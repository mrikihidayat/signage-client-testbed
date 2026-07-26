import { useEffect, useRef } from 'react';
import { WS_BASE_URL } from '../../../api/axios';

export default function useDeviceSocket(setDevices, setPairings) {
  const wsRef = useRef(null);

  useEffect(() => {
    const adminToken = localStorage.getItem('signage_token');
    if (!adminToken) return undefined;

    const ws = new WebSocket(
      `${WS_BASE_URL}/ws?role=dashboard&token=${encodeURIComponent(adminToken)}`
    );
    wsRef.current = ws;

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);

        if (msg.type === 'device_status' || msg.type === 'content_pushed' || msg.type === 'device_updated') {
          setDevices((prev) =>
            prev.map((d) => (d.id === msg.deviceId ? { ...d, ...msg.device } : d))
          );
        }
        if (msg.type === 'device_created') {
          setDevices((prev) => [...prev, msg.device]);
        }
        if (msg.type === 'device_deleted') {
          setDevices((prev) => prev.filter((d) => d.id !== msg.deviceId));
        }
        if (msg.type === 'pairing_requested' && setPairings) {
          setPairings((prev) => [msg.pairing, ...prev]);
        }
        if ((msg.type === 'pairing_approved' || msg.type === 'pairing_rejected') && setPairings) {
          const resolvedId = msg.pairing?.id || msg.pairId;
          setPairings((prev) => prev.filter((p) => p.id !== resolvedId));
        }
      } catch (err) {
        console.error('Gagal parse pesan WS:', err);
      }
    };

    ws.onerror = () => {
      console.warn('Koneksi WebSocket dashboard bermasalah.');
    };

    return () => {
      ws.close();
    };
  }, [setDevices, setPairings]);
}
