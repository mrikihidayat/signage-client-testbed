import { useEffect, useRef, useState } from 'react';
import { contentKey, CROSSFADE_DURATION } from '../constants';

export default function useCrossfadeLayers(content) {
  const [layers, setLayers] = useState([]);
  const layerCleanupTimer = useRef(null);

  useEffect(() => {
    const key = contentKey(content);

    setLayers((prev) => {
      if (prev.length && prev[prev.length - 1].key === key) return prev;
      const faded = prev.map((l) => ({ ...l, visible: false }));
      if (content) faded.push({ key, content, visible: false });
      return faded;
    });

    const raf = requestAnimationFrame(() => {
      setLayers((prev) => prev.map((l, i) => (i === prev.length - 1 ? { ...l, visible: true } : l)));
    });

    if (layerCleanupTimer.current) clearTimeout(layerCleanupTimer.current);
    layerCleanupTimer.current = setTimeout(() => {
      setLayers((prev) => prev.filter((l) => l.key === key));
    }, CROSSFADE_DURATION + 150);

    return () => cancelAnimationFrame(raf);
  }, [content]);

  useEffect(() => () => layerCleanupTimer.current && clearTimeout(layerCleanupTimer.current), []);

  return layers;
}
