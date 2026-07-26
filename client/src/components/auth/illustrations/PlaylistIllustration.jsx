export default function PlaylistIllustration() {
  const items = [
    { w: 150, tone: 0.8 },
    { w: 110, tone: 0.5 },
    { w: 130, tone: 0.3 },
  ];

  return (
    <svg viewBox="0 0 320 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
      <defs>
        <radialGradient id="playlistGlow" cx="35%" cy="50%" r="60%">
          <stop offset="0%" stopColor="#3BBFA2" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#3BBFA2" stopOpacity="0" />
        </radialGradient>
      </defs>

      <circle cx="130" cy="100" r="95" fill="url(#playlistGlow)" />

      <rect x="24" y="24" width="200" height="152" rx="14" fill="#ffffff" fillOpacity="0.06" stroke="#ffffff" strokeOpacity="0.14" />

      {items.map((item, index) => (
        <g key={index} transform={`translate(42 ${52 + index * 38})`}>
          <rect width="26" height="26" rx="6" fill="#3BBFA2" fillOpacity={0.15 + item.tone * 0.2} />
          <path d="M10 8l10 5-10 5V8z" fill="#3BBFA2" fillOpacity={0.5 + item.tone * 0.4} />
          <rect x="38" y="4" width={item.w} height="6" rx="3" fill="#ffffff" fillOpacity={0.15 + item.tone * 0.15} />
          <rect x="38" y="15" width={item.w * 0.55} height="5" rx="2.5" fill="#ffffff" fillOpacity="0.12" />
        </g>
      ))}

      <g transform="translate(232 118)">
        <circle r="44" fill="#12232a" stroke="#3BBFA2" strokeWidth="2.5" />
        <circle r="44" fill="none" stroke="#3BBFA2" strokeOpacity="0.25" strokeWidth="8" strokeDasharray="18 250" />
        <path d="M0 -24V0l16 10" stroke="#3BBFA2" strokeWidth="3" strokeLinecap="round" fill="none" />
        <circle r="3" fill="#3BBFA2" />
      </g>

      <circle cx="276" cy="80" r="3.5" fill="#3BBFA2" className="animate-pulse-dot" />
    </svg>
  );
}
