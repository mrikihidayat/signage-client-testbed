export default function HeroIllustration() {
  return (
    <svg viewBox="0 0 320 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
      <defs>
        <radialGradient id="heroGlow" cx="50%" cy="45%" r="55%">
          <stop offset="0%" stopColor="#3BBFA2" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#3BBFA2" stopOpacity="0" />
        </radialGradient>
      </defs>

      <circle cx="160" cy="95" r="95" fill="url(#heroGlow)" />

      <rect x="18" y="18" width="126" height="78" rx="10" fill="#ffffff" fillOpacity="0.06" stroke="#ffffff" strokeOpacity="0.12" />
      <rect x="30" y="30" width="46" height="6" rx="3" fill="#3BBFA2" fillOpacity="0.7" />
      <rect x="30" y="42" width="70" height="4" rx="2" fill="#ffffff" fillOpacity="0.25" />
      <rect x="30" y="52" width="55" height="4" rx="2" fill="#ffffff" fillOpacity="0.18" />
      <rect x="30" y="66" width="18" height="20" rx="3" fill="#3BBFA2" fillOpacity="0.3" />
      <rect x="52" y="72" width="18" height="14" rx="3" fill="#3BBFA2" fillOpacity="0.5" />
      <rect x="74" y="60" width="18" height="26" rx="3" fill="#3BBFA2" fillOpacity="0.4" />

      <rect x="176" y="18" width="126" height="78" rx="10" fill="#ffffff" fillOpacity="0.06" stroke="#ffffff" strokeOpacity="0.12" />
      <circle cx="200" cy="42" r="12" fill="none" stroke="#3BBFA2" strokeOpacity="0.5" strokeWidth="3" />
      <path d="M200 34v8l6 4" stroke="#3BBFA2" strokeOpacity="0.7" strokeWidth="2" strokeLinecap="round" />
      <rect x="222" y="32" width="66" height="4" rx="2" fill="#ffffff" fillOpacity="0.22" />
      <rect x="222" y="42" width="48" height="4" rx="2" fill="#ffffff" fillOpacity="0.16" />
      <path d="M188 82l14-16 12 10 20-22" stroke="#3BBFA2" strokeOpacity="0.6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />

      <rect x="18" y="106" width="126" height="76" rx="10" fill="#ffffff" fillOpacity="0.06" stroke="#ffffff" strokeOpacity="0.12" />
      <circle cx="42" cy="130" r="4" fill="#3BBFA2" />
      <circle cx="58" cy="130" r="4" fill="#ffffff" fillOpacity="0.35" />
      <circle cx="74" cy="130" r="4" fill="#ffffff" fillOpacity="0.2" />
      <rect x="30" y="146" width="102" height="4" rx="2" fill="#ffffff" fillOpacity="0.2" />
      <rect x="30" y="156" width="80" height="4" rx="2" fill="#ffffff" fillOpacity="0.14" />
      <rect x="30" y="166" width="90" height="4" rx="2" fill="#ffffff" fillOpacity="0.14" />

      <rect x="176" y="106" width="126" height="76" rx="10" fill="#ffffff" fillOpacity="0.06" stroke="#ffffff" strokeOpacity="0.12" />
      <path d="M192 168V140l16-8 16 8v28" stroke="#3BBFA2" strokeOpacity="0.5" strokeWidth="2.5" fill="none" strokeLinejoin="round" />
      <rect x="238" y="130" width="8" height="38" rx="2" fill="#3BBFA2" fillOpacity="0.3" />
      <rect x="250" y="118" width="8" height="50" rx="2" fill="#3BBFA2" fillOpacity="0.45" />
      <rect x="262" y="140" width="8" height="28" rx="2" fill="#3BBFA2" fillOpacity="0.25" />

      <g transform="translate(160 97)">
        <path
          d="M0 -46 L38 -32 V6 C38 34 20 50 0 58 C-20 50 -38 34 -38 6 V-32 Z"
          fill="#12232a"
          fillOpacity="0.85"
          stroke="#3BBFA2"
          strokeWidth="2.5"
        />
        <rect x="-13" y="-6" width="26" height="20" rx="4" fill="#3BBFA2" />
        <path d="M-8 -6v-7a8 8 0 0116 0v7" stroke="#3BBFA2" strokeWidth="3" fill="none" strokeLinecap="round" />
        <circle cx="0" cy="4" r="2.5" fill="#0f1f24" />
      </g>

      <circle cx="292" cy="26" r="4" fill="#3BBFA2" className="animate-pulse-dot" />
    </svg>
  );
}
