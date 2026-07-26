import { Loader2, Wifi, WifiOff } from 'lucide-react';

export default function ConnectionBadge({ status }) {
  const config = {
    connecting: { icon: Loader2, label: 'Menghubungkan...', color: 'text-amber-400', spin: true },
    connected: { icon: Wifi, label: 'Terhubung', color: 'text-primary' },
    disconnected: { icon: WifiOff, label: 'Terputus - Menyambung ulang...', color: 'text-red-400' },
  }[status];

  const Icon = config.icon;

  return (
    <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5 bg-black/40 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full">
      <Icon size={13} className={`${config.color} ${config.spin ? 'animate-spin' : ''}`} />
      <span className="opacity-80">{config.label}</span>
    </div>
  );
}
