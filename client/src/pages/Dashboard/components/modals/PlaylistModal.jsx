import { ArrowDown, ArrowUp, Plus, Trash2 } from 'lucide-react';
import { CustomModal } from '../../../../components/CustomModal';

export default function PlaylistModal({
  open,
  onClose,
  playlistDevice,
  playlistItems,
  setPlaylistItems,
  playlistLoading,
  newPlaylistItem,
  setNewPlaylistItem,
  contents,
  submitting,
  onAddItem,
  onRemoveItem,
  onUpdateDuration,
  onMoveItem,
  onActivate,
  onDeactivate,
}) {
  return (
    <CustomModal
      open={open}
      onClose={onClose}
      title={`Playlist - ${playlistDevice?.nama || ''}`}
      widthClass="max-w-lg"
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between bg-bgmint-light dark:bg-slate-900 rounded-xl px-4 py-3">
          <div>
            <p className="text-xs text-inktext-muted dark:text-slate-400">Status Mode</p>
            <p className="text-sm font-medium text-inktext dark:text-slate-100">
              {playlistDevice?.mode === 'playlist' ? 'Playlist Aktif' : 'Konten Tunggal'}
            </p>
          </div>
          {playlistDevice?.mode === 'playlist' ? (
            <button
              onClick={onDeactivate}
              disabled={submitting}
              className="text-xs font-medium text-red-500 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 disabled:opacity-60 px-3 py-1.5 rounded-lg transition-colors"
            >
              Nonaktifkan
            </button>
          ) : (
            <button
              onClick={onActivate}
              disabled={submitting || playlistItems.length === 0}
              className="text-xs font-medium text-primary-dark bg-primary/10 hover:bg-primary/20 disabled:opacity-50 px-3 py-1.5 rounded-lg transition-colors"
            >
              Aktifkan Playlist
            </button>
          )}
        </div>

        <form onSubmit={onAddItem} className="flex flex-col gap-2 sm:flex-row sm:items-end">
          <div className="flex-1">
            <label className="text-xs font-medium text-secondary dark:text-slate-300 mb-1.5 block">Tambah Konten</label>
            <select
              value={newPlaylistItem.contentId}
              onChange={(e) => setNewPlaylistItem({ ...newPlaylistItem, contentId: e.target.value })}
              className="w-full px-3 py-2.5 rounded-xl border border-secondary/15 dark:border-slate-600 bg-bgmint-light dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm text-inktext dark:text-slate-100"
            >
              <option value="">-- Pilih Konten --</option>
              {contents.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.judul} ({c.tipe})
                </option>
              ))}
            </select>
          </div>
          <div className="w-full sm:w-28">
            <label className="text-xs font-medium text-secondary dark:text-slate-300 mb-1.5 block">Durasi (detik)</label>
            <input
              type="number"
              min={1}
              value={newPlaylistItem.durasi_detik}
              onChange={(e) => setNewPlaylistItem({ ...newPlaylistItem, durasi_detik: Number(e.target.value) })}
              className="w-full px-3 py-2.5 rounded-xl border border-secondary/15 dark:border-slate-600 bg-bgmint-light dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm text-inktext dark:text-slate-100"
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="flex items-center justify-center gap-1.5 bg-primary hover:bg-primary-dark disabled:opacity-60 text-white font-medium px-4 py-2.5 rounded-xl transition-colors text-sm shrink-0"
          >
            <Plus size={15} />
            Tambah
          </button>
        </form>

        <div>
          <p className="text-xs font-medium text-secondary dark:text-slate-300 mb-2">
            Urutan Pemutaran {playlistItems.length > 0 && `(${playlistItems.length} konten)`}
          </p>

          {playlistLoading && (
            <p className="text-sm text-inktext-muted dark:text-slate-400 text-center py-6">Memuat playlist...</p>
          )}

          {!playlistLoading && playlistItems.length === 0 && (
            <p className="text-sm text-inktext-muted dark:text-slate-400 text-center py-6 border border-dashed border-secondary/20 dark:border-slate-600 rounded-xl">
              Playlist masih kosong. Tambahkan konten di atas.
            </p>
          )}

          {!playlistLoading && playlistItems.length > 0 && (
            <div className="flex flex-col gap-2 max-h-64 overflow-y-auto scrollbar-thin pr-1">
              {playlistItems.map((item, index) => (
                <div
                  key={item.id}
                  className="flex items-center gap-2 border border-secondary/10 dark:border-white/10 rounded-xl px-3 py-2"
                >
                  <span className="text-xs font-semibold text-secondary/50 dark:text-slate-500 w-5 text-center shrink-0">
                    {index + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-inktext dark:text-slate-100 truncate">
                      {item.contents ? item.contents.judul : 'Konten sudah dihapus'}
                    </p>
                    <p className="text-[11px] text-inktext-muted dark:text-slate-400 uppercase">
                      {item.contents?.tipe}
                    </p>
                  </div>
                  <input
                    type="number"
                    min={1}
                    value={item.durasi_detik}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setPlaylistItems((prev) =>
                        prev.map((it) => (it.id === item.id ? { ...it, durasi_detik: val } : it))
                      );
                    }}
                    onBlur={(e) => onUpdateDuration(item.id, Number(e.target.value))}
                    className="w-16 shrink-0 px-2 py-1.5 rounded-lg border border-secondary/15 dark:border-slate-600 bg-bgmint-light dark:bg-slate-900 text-xs text-center text-inktext dark:text-slate-100"
                    title="Durasi tayang (detik)"
                  />
                  <div className="flex flex-col shrink-0">
                    <button
                      onClick={() => onMoveItem(index, 'up')}
                      disabled={index === 0}
                      className="text-secondary/50 hover:text-secondary disabled:opacity-30 transition-colors"
                      title="Naikkan urutan"
                    >
                      <ArrowUp size={14} />
                    </button>
                    <button
                      onClick={() => onMoveItem(index, 'down')}
                      disabled={index === playlistItems.length - 1}
                      className="text-secondary/50 hover:text-secondary disabled:opacity-30 transition-colors"
                      title="Turunkan urutan"
                    >
                      <ArrowDown size={14} />
                    </button>
                  </div>
                  <button
                    onClick={() => onRemoveItem(item.id)}
                    className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors shrink-0"
                    title="Hapus dari playlist"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </CustomModal>
  );
}
