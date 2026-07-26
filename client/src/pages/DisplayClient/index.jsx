import { useParams, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff, Maximize, Minimize, MonitorPlay, ShieldAlert } from 'lucide-react';
import { CROSSFADE_DURATION } from './constants';
import useDisplayContent from './hooks/useDisplayContent';
import useDisplaySocket from './hooks/useDisplaySocket';
import useCrossfadeLayers from './hooks/useCrossfadeLayers';
import useFullscreen from './hooks/useFullscreen';
import useIdleControls from './hooks/useIdleControls';
import useHideBadges from './hooks/useHideBadges';
import ConnectionBadge from './components/ConnectionBadge';
import PlaylistBadge from './components/PlaylistBadge';
import ContentStage from './components/ContentStage';

export default function DisplayClient() {
  const { deviceId } = useParams();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const { content, playlist, playlistIndex, applyPushContent, applyPushPlaylist } = useDisplayContent();
  const connStatus = useDisplaySocket(deviceId, token, { applyPushContent, applyPushPlaylist });
  const layers = useCrossfadeLayers(content);
  const { stageRef, isFullscreen, toggleFullscreen } = useFullscreen();
  const showControls = useIdleControls();
  const { hideBadges, toggleHideBadges } = useHideBadges(deviceId);

  if (!token) {
    return (
      <div className="w-screen h-screen bg-black flex flex-col items-center justify-center gap-3 text-white/70 text-center px-6">
        <ShieldAlert size={56} className="text-red-400" />
        <p className="text-lg font-medium">Link display tidak valid.</p>
        <p className="text-sm text-white/40 max-w-sm">
          Token akses tidak ditemukan pada URL. Salin ulang link display dari Dashboard Admin (tombol
          "Salin Link Display" pada device terkait).
        </p>
      </div>
    );
  }

  const isPlaylistMode = playlist && playlist.length > 1;
  const controlsVisible = showControls || connStatus !== 'connected';

  return (
    <div ref={stageRef} className="w-screen h-screen bg-black relative overflow-hidden select-none">
      <div
        className={`transition-opacity duration-500 ${
          controlsVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        {!hideBadges && <ConnectionBadge status={connStatus} />}
        {!hideBadges && isPlaylistMode && (
          <PlaylistBadge index={playlistIndex} total={playlist.length} />
        )}

        <div className="absolute bottom-4 right-4 z-20 flex items-center gap-2">
          <button
            type="button"
            onClick={toggleHideBadges}
            title={hideBadges ? 'Tampilkan indikator status' : 'Sembunyikan indikator status'}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-black/40 backdrop-blur-sm text-white/80 hover:text-white hover:bg-black/60 transition-colors"
          >
            {hideBadges ? <Eye size={15} /> : <EyeOff size={15} />}
          </button>
          <button
            type="button"
            onClick={toggleFullscreen}
            title={isFullscreen ? 'Keluar layar penuh (F)' : 'Layar penuh (F)'}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-black/40 backdrop-blur-sm text-white/80 hover:text-white hover:bg-black/60 transition-colors"
          >
            {isFullscreen ? <Minimize size={15} /> : <Maximize size={15} />}
          </button>
        </div>
      </div>

      {layers.length === 0 && (
        <div className="w-full h-full flex flex-col items-center justify-center gap-4 text-white/70">
          <MonitorPlay size={64} className="text-primary" />
          <p className="text-lg font-medium">Menunggu konten dari Dashboard Admin...</p>
          <p className="text-sm text-white/40">Device ID: {deviceId}</p>
        </div>
      )}

      {layers.map((layer) => (
        <div
          key={layer.key}
          className="absolute inset-0 transition-opacity ease-in-out"
          style={{
            opacity: layer.visible ? 1 : 0,
            transitionDuration: `${CROSSFADE_DURATION}ms`,
          }}
        >
          <ContentStage content={layer.content} isPlaylistMode={isPlaylistMode} />
        </div>
      ))}
    </div>
  );
}
