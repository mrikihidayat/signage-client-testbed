import { ListVideo } from 'lucide-react';

export default function PlaylistBadge({ index, total }) {
  return (
    <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5 bg-black/40 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full">
      <ListVideo size={13} className="text-primary" />
      <span className="opacity-80">
        Playlist {index + 1}/{total}
      </span>
    </div>
  );
}
