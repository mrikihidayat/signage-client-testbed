export default function MonitorIllustration() {
  const devices = [
    { x: 24, y: 24, online: true },
    { x: 128, y: 24, online: true },
    { x: 232, y: 24, online: false },
    { x: 24, y: 106, online: false },
    { x: 128, y: 106, online: true },
    { x: 232, y: 106, online: true },
  ];

  return (
    <svg viewBox="0 0 320 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
      <defs>
        <radialGradient id="monitorGlow" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="#3BBFA2" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#3BBFA2" stopOpacity="0" />
        </radialGradient>
      </defs>

      <circle cx="160" cy="100" r="95" fill="url(#monitorGlow)" />

      {devices.map((device, index) => (
        <g key={index} transform={`translate(${device.x} ${device.y})`}>
          <rect
            width="64"
            height="70"
            rx="8"
            fill="#ffffff"
            fillOpacity="0.06"
            stroke={device.online ? '#3BBFA2' : '#ffffff'}
            strokeOpacity={device.online ? 0.4 : 0.14}
          />
          <rect x="8" y="10" width="34" height="4" rx="2" fill="#ffffff" fillOpacity="0.2" />
          <rect x="8" y="18" width="24" height="3" rx="1.5" fill="#ffffff" fillOpacity="0.14" />
          <rect x="8" y="30" width="48" height="26" rx="4" fill={device.online ? '#3BBFA2' : '#ffffff'} fillOpacity={device.online ? 0.16 : 0.06} />
          <circle cx="14" cy="60" r="3.5" fill={device.online ? '#3BBFA2' : '#64748b'} className={device.online ? 'animate-pulse-dot' : ''} />
          <rect x="22" y="58" width="24" height="4" rx="2" fill="#ffffff" fillOpacity="0.16" />
        </g>
      ))}
    </svg>
  );
}
