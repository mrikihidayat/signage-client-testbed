import { Tv, Wifi, WifiOff } from 'lucide-react';
import StatusCard from './StatusCard';

export default function StatusCards({ total, onlineCount, offlineCount }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
      <StatusCard label="Total Device" value={total} icon={Tv} accent="secondary" />
      <StatusCard label="Device Online" value={onlineCount} icon={Wifi} accent="primary" />
      <StatusCard label="Device Offline" value={offlineCount} icon={WifiOff} accent="muted" />
    </div>
  );
}
