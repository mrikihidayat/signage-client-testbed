import { useCallback, useEffect, useRef, useState } from 'react';
import { CONTROLS_IDLE_DELAY } from '../constants';

export default function useIdleControls() {
  const [showControls, setShowControls] = useState(true);
  const controlsIdleTimer = useRef(null);

  const wakeControls = useCallback(() => {
    setShowControls(true);
    if (controlsIdleTimer.current) clearTimeout(controlsIdleTimer.current);
    controlsIdleTimer.current = setTimeout(() => setShowControls(false), CONTROLS_IDLE_DELAY);
  }, []);

  useEffect(() => {
    wakeControls();
    const events = ['mousemove', 'touchstart', 'click'];
    events.forEach((ev) => window.addEventListener(ev, wakeControls));
    return () => {
      events.forEach((ev) => window.removeEventListener(ev, wakeControls));
      if (controlsIdleTimer.current) clearTimeout(controlsIdleTimer.current);
    };
  }, [wakeControls]);

  return showControls;
}
