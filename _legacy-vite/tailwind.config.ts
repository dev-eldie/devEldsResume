import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#07070d",
        "ink-2": "#0c0c16",
        "ink-3": "#11111c",
        surface: "rgba(255,255,255,0.04)",
        "surface-strong": "rgba(255,255,255,0.07)",
        hairline: "rgba(255,255,255,0.08)",
        "hairline-strong": "rgba(255,255,255,0.16)",
        fg: "#ECECF2",
        "fg-muted": "#9494AD",
        "fg-dim": "#5C5C75",
        cyan: {
          DEFAULT: "#00E5FF",
          glow: "#22F5FF",
        },
        violet: {
          DEFAULT: "#A78BFA",
          glow: "#C4B5FD",
        },
        lime: {
          DEFAULT: "#D9FF5B",
          glow: "#E8FF8A",
        },
        magenta: {
          DEFAULT: "#FF3DA6",
          glow: "#FF7ABF",
        },
      },
      fontFamily: {
        // Three faces only — display for headlines, sans for body, mono for labels
        display: ['"Unbounded"', "system-ui", "sans-serif"],
        sans: ['"Manrope"', "system-ui", "sans-serif"],
        mono: ['"JetBrains Mono"', "ui-monospace", "monospace"],
      },
      boxShadow: {
        // neomorphism on dark — paired light + shadow
        neo: "8px 8px 24px rgba(0,0,0,0.55), -8px -8px 24px rgba(255,255,255,0.025)",
        "neo-sm": "4px 4px 12px rgba(0,0,0,0.5), -4px -4px 12px rgba(255,255,255,0.02)",
        "neo-inset":
          "inset 6px 6px 14px rgba(0,0,0,0.55), inset -6px -6px 14px rgba(255,255,255,0.02)",
        glow: "0 0 24px rgba(0,229,255,0.35)",
        "glow-violet": "0 0 24px rgba(167,139,250,0.4)",
        "glow-lime": "0 0 24px rgba(217,255,91,0.35)",
      },
      backgroundImage: {
        grid: "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
        radial:
          "radial-gradient(ellipse at top, rgba(167,139,250,0.18), transparent 60%)",
        "radial-cyan":
          "radial-gradient(ellipse at bottom right, rgba(0,229,255,0.2), transparent 55%)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(28px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.92)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "marquee-rev": {
          "0%": { transform: "translateX(-50%)" },
          "100%": { transform: "translateX(0)" },
        },
        "pulse-soft": {
          "0%,100%": { opacity: "0.55" },
          "50%": { opacity: "1" },
        },
        "blink-caret": {
          "0%,49%": { opacity: "1" },
          "50%,100%": { opacity: "0" },
        },
        float: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        spinslow: {
          to: { transform: "rotate(360deg)" },
        },
      },
      animation: {
        "fade-up": "fade-up 700ms cubic-bezier(0.16,1,0.3,1) both",
        "fade-in": "fade-in 600ms ease-out both",
        "scale-in": "scale-in 600ms cubic-bezier(0.16,1,0.3,1) both",
        marquee: "marquee 40s linear infinite",
        "marquee-rev": "marquee-rev 40s linear infinite",
        "pulse-soft": "pulse-soft 2.6s ease-in-out infinite",
        "blink-caret": "blink-caret 1.1s steps(1) infinite",
        float: "float 6s ease-in-out infinite",
        shimmer: "shimmer 2.4s linear infinite",
        spinslow: "spinslow 22s linear infinite",
      },
    },
  },
  plugins: [],
} satisfies Config;
