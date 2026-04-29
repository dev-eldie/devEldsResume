import { Suspense, lazy, ComponentType, useEffect, useRef, useState } from "react";

type Loader<T> = () => Promise<{ default: ComponentType<T> }>;

/**
 * Render a section only after it nears the viewport — pairs React.lazy
 * with an IntersectionObserver gate. Works the same in Vite and Next.js
 * client components; for Next.js SSR you'd swap to next/dynamic.
 */
export function LazySection<T extends object = object>({
  loader,
  rootMargin = "200px 0px",
  fallback,
  ...props
}: {
  loader: Loader<T>;
  rootMargin?: string;
  fallback?: React.ReactNode;
} & T) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [should, setShould] = useState(false);
  const [Cmp] = useState(() => lazy(loader));

  useEffect(() => {
    if (should) return;
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setShould(true);
            obs.disconnect();
          }
        });
      },
      { rootMargin },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [should, rootMargin]);

  return (
    <div ref={ref}>
      {should ? (
        <Suspense fallback={fallback ?? <SectionSkeleton />}>
          {/* @ts-expect-error - generic component prop spreading */}
          <Cmp {...(props as T)} />
        </Suspense>
      ) : (
        fallback ?? <SectionSkeleton />
      )}
    </div>
  );
}

function SectionSkeleton() {
  return (
    <div className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5">
        <div className="h-3 w-32 rounded-full neo-inset overflow-hidden mb-6">
          <div className="h-full w-1/2 bg-gradient-to-r from-cyan/50 to-violet/50 animate-pulse-soft" />
        </div>
        <div className="h-12 w-3/4 rounded-2xl neo-inset animate-pulse-soft mb-8" />
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="h-44 rounded-3xl neo-inset animate-pulse-soft" />
          <div className="h-44 rounded-3xl neo-inset animate-pulse-soft" />
          <div className="h-44 rounded-3xl neo-inset animate-pulse-soft" />
        </div>
      </div>
    </div>
  );
}
