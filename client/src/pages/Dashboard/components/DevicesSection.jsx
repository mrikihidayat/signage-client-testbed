import { Copy, ListVideo, MapPin, Pencil, Plus, Search, Send, Trash2 } from 'lucide-react';
import StatusBadge from './StatusBadge';

export default function DevicesSection({
  devices,
  filteredDevices,
  deviceSearch,
  setDeviceSearch,
  onAddClick,
  onCopyLink,
  onEditClick,
  onPlaylistClick,
  onPushClick,
  onDeleteClick,
}) {
  return (
    <section className="bg-white dark:bg-slate-800 rounded-2xl shadow-card overflow-hidden transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 py-4 border-b border-secondary/10 dark:border-white/10">
        <h2 className="font-semibold text-secondary dark:text-white">Daftar Device</h2>
        <div className="flex items-center gap-2 flex-wrap justify-end">
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary/40" />
            <input
              type="text"
              value={deviceSearch}
              onChange={(e) => setDeviceSearch(e.target.value)}
              placeholder="Cari nama / lokasi..."
              className="pl-9 pr-3 py-1.5 rounded-lg border border-secondary/15 dark:border-slate-600 bg-bgmint-light dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm w-48 text-inktext dark:text-slate-100"
            />
          </div>
          <button
            onClick={onAddClick}
            className="flex items-center gap-1.5 text-sm font-medium text-primary-dark bg-primary/10 hover:bg-primary/20 px-3 py-1.5 rounded-lg transition-colors shrink-0"
          >
            <Plus size={16} />
            Tambah Device
          </button>
        </div>
      </div>

      <div className="overflow-x-auto scrollbar-thin">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-inktext-muted dark:text-slate-400 uppercase bg-bgmint-light dark:bg-slate-900">
              <th className="px-6 py-3 font-medium">Nama Device</th>
              <th className="px-6 py-3 font-medium">Lokasi</th>
              <th className="px-6 py-3 font-medium">Status</th>
              <th className="px-6 py-3 font-medium">Konten Aktif</th>
              <th className="px-6 py-3 font-medium text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredDevices.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-inktext-muted dark:text-slate-400">
                  {devices.length === 0
                    ? 'Belum ada device. Tambahkan device pertama Anda.'
                    : 'Tidak ada device yang cocok dengan pencarian.'}
                </td>
              </tr>
            )}
            {filteredDevices.map((d) => (
              <tr key={d.id} className="border-t border-secondary/5 dark:border-white/5 hover:bg-bgmint-light/60 dark:hover:bg-white/5 transition-colors">
                <td className="px-6 py-3.5 font-medium text-inktext dark:text-slate-100">{d.nama}</td>
                <td className="px-6 py-3.5 text-inktext-muted dark:text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <MapPin size={14} className="text-secondary/40" />
                    {d.lokasi}
                  </span>
                </td>
                <td className="px-6 py-3.5">
                  <StatusBadge status={d.status} />
                </td>
                <td className="px-6 py-3.5 text-inktext-muted dark:text-slate-400">
                  {d.mode === 'playlist' ? (
                    <span className="inline-flex items-center gap-1.5 text-primary-dark dark:text-primary font-medium">
                      <ListVideo size={14} />
                      Mode Playlist
                    </span>
                  ) : d.contents ? (
                    d.contents.judul
                  ) : (
                    <span className="italic text-inktext-muted/50">Belum ada</span>
                  )}
                </td>
                <td className="px-6 py-3.5">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => onCopyLink(d)}
                      className="p-1.5 rounded-lg text-secondary hover:bg-secondary/10 transition-colors"
                      title="Salin Link Display"
                    >
                      <Copy size={16} />
                    </button>
                    <button
                      onClick={() => onEditClick(d)}
                      className="p-1.5 rounded-lg text-secondary hover:bg-secondary/10 transition-colors"
                      title="Edit Device"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => onPlaylistClick(d)}
                      className="p-1.5 rounded-lg text-secondary hover:bg-secondary/10 transition-colors"
                      title="Kelola Playlist"
                    >
                      <ListVideo size={16} />
                    </button>
                    <button
                      onClick={() => onPushClick(d.id)}
                      className="p-1.5 rounded-lg text-primary-dark hover:bg-primary/10 transition-colors"
                      title="Push Content"
                    >
                      <Send size={16} />
                    </button>
                    <button
                      onClick={() => onDeleteClick(d.id, d.nama)}
                      className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                      title="Hapus Device"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
