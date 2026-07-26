import { useEffect, useRef, useState } from 'react';

export default function useDisplayContent() {
  const [content, setContent] = useState(null);
  const [playlist, setPlaylist] = useState(null);
  const [playlistIndex, setPlaylistIndex] = useState(0);
  const playlistTimerRef = useRef(null);

  useEffect(() => {
    if (playlistTimerRef.current) {
      clearTimeout(playlistTimerRef.current);
      playlistTimerRef.current = null;
    }

    if (!playlist || playlist.length === 0) return;

    const current = playlist[playlistIndex];
    setContent(current.content);

    if (playlist.length > 1) {
      const durationMs = Math.max(1, current.durasi_detik || 10) * 1000;
      playlistTimerRef.current = setTimeout(() => {
        setPlaylistIndex((prev) => (prev + 1) % playlist.length);
      }, durationMs);
    }

    return () => {
      if (playlistTimerRef.current) clearTimeout(playlistTimerRef.current);
    };
  }, [playlist, playlistIndex]);

  const applyPushContent = (pushedContent) => {
    setPlaylist(null);
    setPlaylistIndex(0);
    setContent(pushedContent || null);
  };

  const applyPushPlaylist = (items) => {
    setPlaylist(items.length > 0 ? items : null);
    setPlaylistIndex(0);
    if (items.length === 0) setContent(null);
  };

  return {
    content,
    playlist,
    playlistIndex,
    applyPushContent,
    applyPushPlaylist,
  };
}
