export default function BackgroundPattern() {
  return (
    <>
      <style>{`
        @keyframes floatMark {
          0% { transform: translateY(0) rotate(-6deg); opacity: 0; }
          15% { opacity: .5; }
          85% { opacity: .3; }
          100% { transform: translateY(-170px) rotate(8deg); opacity: 0; }
        }
        .mark-1 { animation: floatMark 8s linear infinite; animation-delay: 0s; }
        .mark-2 { animation: floatMark 9.5s linear infinite; animation-delay: 2.5s; }
        .mark-3 { animation: floatMark 7s linear infinite; animation-delay: 4.5s; }
        @media (prefers-reduced-motion: reduce) {
          .mark-1, .mark-2, .mark-3 { animation: none !important; }
        }
      `}</style>
      <svg className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true">
        <defs>
          <pattern id="vetGrid" width="64" height="64" patternUnits="userSpaceOnUse" patternTransform="rotate(6)">
            <circle cx="8" cy="8" r="2" fill="#F7EFE1" opacity="0.12" />
            <path d="M40 4 v8 M36 8 h8" stroke="#F7EFE1" strokeWidth="1.4" opacity="0.1" strokeLinecap="round" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#vetGrid)" />
        <g className="mark-1" transform="translate(60,340)">
          <PawGlyph />
        </g>
        <g className="mark-2" transform="translate(330,360) scale(0.8)">
          <PawGlyph />
        </g>
        <g className="mark-3" transform="translate(210,380) scale(0.6)">
          <PawGlyph />
        </g>
      </svg>
    </>
  );
}

function PawGlyph() {
  return (
    <g fill="#F7EFE1">
      <ellipse cx="0" cy="0" rx="9" ry="11" />
      <ellipse cx="-11" cy="-14" rx="4" ry="5" />
      <ellipse cx="-4" cy="-19" rx="4" ry="5" />
      <ellipse cx="4" cy="-19" rx="4" ry="5" />
      <ellipse cx="11" cy="-14" rx="4" ry="5" />
    </g>
  );
}
