import { useState } from 'react';

export default function useHideBadges(deviceId) {
  const [hideBadges, setHideBadges] = useState(() => {
    try {
      return localStorage.getItem(`display_hide_badges_${deviceId}`) === '1';
    } catch {
      return false;
    }
  });

  const toggleHideBadges = () => {
    setHideBadges((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(`display_hide_badges_${deviceId}`, next ? '1' : '0');
      } catch {
        }
      return next;
    });
  };

  return { hideBadges, toggleHideBadges };
}
