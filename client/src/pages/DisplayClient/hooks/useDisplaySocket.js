import { useEffect, useRef, useState } from 'react';
import { WS_BASE_URL } from '../../../api/axios';
import { RECONNECT_BASE_DELAY, RECONNECT_MAX_DELAY } from '../constants';

export default function useDisplaySocket(deviceId, token, { applyPushContent, applyPushPlaylist }) {
  const [connStatus, setConnStatus] = useState('connecting');
  const wsRef = useRef(null);
  const reconnectAttempt = useRef(0);
  const reconnectTimer = useRef(null);
  const closedByUser = useRef(false);

  useEffect(() => {
    if (!token) return undefined;

    function connect() {
      setConnStatus('connecting');
      const ws = new WebSocket(
        `${WS_BASE_URL}/ws?deviceId=${encodeURIComponent(deviceId)}&token=${encodeURIComponent(token)}`
      );
      wsRef.current = ws;

      ws.onopen = () => {
        reconnectAttempt.current = 0;
        setConnStatus('connected');
      };

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);

          if (msg.type === 'push_content') {
            applyPushContent(msg.content);
          }

          if (msg.type === 'push_playlist' && Array.isArray(msg.items)) {
            applyPushPlaylist(msg.items);
          }
        } catch (err) {
          console.error('Gagal parse pesan dari server:', err);
        }
      };

      ws.onclose = () => {
        setConnStatus('disconnected');
        if (!closedByUser.current) {
          scheduleReconnect();
        }
      };

      ws.onerror = () => {
        ws.close();
      };
    }

    function scheduleReconnect() {
      reconnectAttempt.current += 1;
      const delay = Math.min(
        RECONNECT_BASE_DELAY * Math.pow(1.6, reconnectAttempt.current),
        RECONNECT_MAX_DELAY
      );
      reconnectTimer.current = setTimeout(() => {
        if (!closedByUser.current) connect();
      }, delay);
    }

    closedByUser.current = false;
    connect();

    return () => {
      closedByUser.current = true;
      if (reconnectTimer.current) clearTimeout(reconnectTimer.current);
      if (wsRef.current) wsRef.current.close();
    };
  }, [deviceId, token]);

  return connStatus;
}
