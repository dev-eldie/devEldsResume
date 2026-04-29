/**
 * "< EA />" logo tag — JSX self-closing tag style.
 *
 * Visually:  ⟨ EA /⟩
 *  - opening `<` on the left
 *  - bold "EA" in Space Grotesk
 *  - closing `/>` on the right
 *
 * Renders as a single rounded gradient pill so it sits at 32px height
 * inside the nav. Inherits color via currentColor (white over the gradient).
 *
 * <DefaultLogoTag/>  → the gradient pill (default brand mark)
 * <DefaultLogoBare/> → outlined gradient version, no plate (kept for future use)
 */

export function DefaultLogoTag() {
  return (
    <span className="logo-tag" aria-label="EA dev">
      {/* opening < */}
      <svg className="logo-bracket" viewBox="0 0 10 16" fill="none" aria-hidden="true">
        <path
          d="M7.5 2 L2.5 8 L7.5 14"
          stroke="currentColor"
          strokeWidth="1.9"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      <span className="logo-letters">EA</span>

      {/* closing /> */}
      <svg className="logo-bracket" viewBox="0 0 14 16" fill="none" aria-hidden="true">
        <path
          d="M3 14 L8 2"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <path
          d="M7.5 2 L12.5 8 L7.5 14"
          stroke="currentColor"
          strokeWidth="1.9"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

export function DefaultLogoBare({ size = 56 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 80 32"
      width={size}
      height={(size / 80) * 32}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="eaTagGrad" x1="0" y1="0" x2="80" y2="32" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#a78bfa" />
          <stop offset="50%" stopColor="#22d3ee" />
          <stop offset="100%" stopColor="#f472b6" />
        </linearGradient>
      </defs>
      {/* < */}
      <path d="M14 8 L6 16 L14 24" fill="none" stroke="url(#eaTagGrad)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      {/* EA */}
      <text
        x="40"
        y="22.5"
        fontFamily="Space Grotesk, sans-serif"
        fontWeight="700"
        fontSize="17"
        fill="url(#eaTagGrad)"
        textAnchor="middle"
        letterSpacing="0.5"
      >
        EA
      </text>
      {/* /> */}
      <path d="M58 24 L66 8" stroke="url(#eaTagGrad)" strokeWidth="2" strokeLinecap="round" />
      <path d="M66 8 L74 16 L66 24" fill="none" stroke="url(#eaTagGrad)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
