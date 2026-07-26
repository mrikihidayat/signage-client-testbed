export default function BroadcastIllustration() {
  return (
    <svg viewBox="0 0 320 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
      <defs>
        <radialGradient id="broadcastGlow" cx="50%" cy="50%" r="55%">
          <stop offset="0%" stopColor="#3BBFA2" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#3BBFA2" stopOpacity="0" />
        </radialGradient>
      </defs>

      <circle cx="160" cy="100" r="90" fill="url(#broadcastGlow)" />

      <circle cx="160" cy="100" r="70" stroke="#3BBFA2" strokeOpacity="0.18" strokeWidth="1.5" fill="none" />
      <circle cx="160" cy="100" r="46" stroke="#3BBFA2" strokeOpacity="0.28" strokeWidth="1.5" fill="none" />

      <g transform="translate(132 78)">
        <rect width="56" height="42" rx="6" fill="#12232a" stroke="#3BBFA2" strokeWidth="2" />
        <rect x="8" y="8" width="40" height="4" rx="2" fill="#3BBFA2" fillOpacity="0.7" />
        <rect x="8" y="16" width="28" height="4" rx="2" fill="#ffffff" fillOpacity="0.3" />
        <rect x="8" y="24" width="32" height="4" rx="2" fill="#ffffff" fillOpacity="0.2" />
        <rect x="20" y="42" width="16" height="6" rx="2" fill="#3BBFA2" fillOpacity="0.5" />
      </g>

      {[
        { x: 30, y: 22 },
        { x: 244, y: 18 },
        { x: 24, y: 132 },
        { x: 250, y: 136 },
      ].map((pos, index) => (
        <g key={index} transform={`translate(${pos.x} ${pos.y})`}>
          <rect width="40" height="30" rx="5" fill="#ffffff" fillOpacity="0.07" stroke="#ffffff" strokeOpacity="0.16" />
          <rect x="6" y="7" width="24" height="3.5" rx="1.75" fill="#3BBFA2" fillOpacity="0.6" />
          <rect x="6" y="14" width="16" height="3" rx="1.5" fill="#ffffff" fillOpacity="0.25" />
          <rect x="6" y="20" width="20" height="3" rx="1.5" fill="#ffffff" fillOpacity="0.18" />
        </g>
      ))}

      <path d="M160 78 L50 40" stroke="#3BBFA2" strokeOpacity="0.35" strokeWidth="1.5" strokeDasharray="3 5" />
      <path d="M188 82 L264 32" stroke="#3BBFA2" strokeOpacity="0.35" strokeWidth="1.5" strokeDasharray="3 5" />
      <path d="M150 120 L44 138" stroke="#3BBFA2" strokeOpacity="0.35" strokeWidth="1.5" strokeDasharray="3 5" />
      <path d="M180 120 L270 142" stroke="#3BBFA2" strokeOpacity="0.35" strokeWidth="1.5" strokeDasharray="3 5" />

      <circle cx="160" cy="60" r="3.5" fill="#3BBFA2" className="animate-pulse-dot" />
    </svg>
  );
}
