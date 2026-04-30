"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

interface ProfileSliderProps {
  images: string[];
  alt: string;
}

export function ProfileSlider({ images, alt }: ProfileSliderProps) {
  const [current, setCurrent] = useState(0);
  const [phase, setPhase] = useState<"idle" | "leaving" | "entering">("idle");
  const [bgSrc, setBgSrc] = useState(images[0] ?? "");
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (images.length <= 1) return;

    timerRef.current = setInterval(() => {
      setPhase("leaving");

      setTimeout(() => {
        setCurrent((i) => {
          const next = (i + 1) % images.length;
          setBgSrc(images[next]);
          return next;
        });
        setPhase("entering");

        setTimeout(() => {
          setPhase("idle");
        }, 700);
      }, 400);
    }, 4000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [images]);

  if (!images.length) return null;

  const src = images[current];
  const isLocal = src.startsWith("/");

  return (
    <div className="profile-slider">
      <div
        className="profile-slider-bg"
        style={{ backgroundImage: `url(${bgSrc})` }}
        aria-hidden="true"
      />
      <div className={`profile-slide phase-${phase}`}>
        {isLocal ? (
          <Image
            src={src}
            alt={alt}
            fill
            sizes="(max-width: 600px) 100vw, 400px"
            className="profile-photo"
            priority={current === 0}
            quality={85}
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt={alt} className="profile-photo" />
        )}
        <div className="photo-fuse" aria-hidden="true" />
        <div className="photo-tint" aria-hidden="true" />
        <div className="photo-vignette" aria-hidden="true" />
      </div>
      {images.length > 1 && (
        <div className="slider-dots" aria-hidden="true">
          {images.map((_, i) => (
            <span key={i} className={`slider-dot${i === current ? " active" : ""}`} />
          ))}
        </div>
      )}
    </div>
  );
}
