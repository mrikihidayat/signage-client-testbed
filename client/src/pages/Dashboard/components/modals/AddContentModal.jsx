import { Eye } from 'lucide-react';
import { CustomModal } from '../../../../components/CustomModal';
import ContentPreview from '../ContentPreview';

export default function AddContentModal({
  open,
  onClose,
  newContent,
  setNewContent,
  showAddPreview,
  setShowAddPreview,
  onSubmit,
  submitting,
}) {
  return (
    <CustomModal open={open} onClose={onClose} title="Tambah Konten Baru">
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <div>
          <label className="text-xs font-medium text-secondary dark:text-slate-300 mb-1.5 block">Judul Konten</label>
          <input
            type="text"
            value={newContent.judul}
            onChange={(e) => setNewContent({ ...newContent, judul: e.target.value })}
            placeholder="Contoh: Promo Bulan Ini"
            className="w-full px-3 py-2.5 rounded-xl border border-secondary/15 dark:border-slate-600 bg-bgmint-light dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm text-inktext dark:text-slate-100"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-secondary dark:text-slate-300 mb-1.5 block">Tipe Konten</label>
          <div className="grid grid-cols-3 gap-2">
            {['image', 'video', 'url'].map((t) => (
              <button
                type="button"
                key={t}
                onClick={() => setNewContent({ ...newContent, tipe: t })}
                className={`py-2 rounded-xl text-sm font-medium capitalize border transition-colors ${
                  newContent.tipe === t
                    ? 'bg-primary text-white border-primary'
                    : 'border-secondary/15 dark:border-slate-600 text-secondary dark:text-slate-300 hover:bg-secondary/5 dark:hover:bg-white/5'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="text-xs font-medium text-secondary dark:text-slate-300 mb-1.5 block">
            {newContent.tipe === 'url' ? 'URL Halaman' : 'URL File'}
          </label>
          <input
            type="text"
            value={newContent.payload_url}
            onChange={(e) => setNewContent({ ...newContent, payload_url: e.target.value })}
            placeholder="https://..."
            className="w-full px-3 py-2.5 rounded-xl border border-secondary/15 dark:border-slate-600 bg-bgmint-light dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm text-inktext dark:text-slate-100"
          />
        </div>
        <button
          type="button"
          onClick={() => setShowAddPreview((s) => !s)}
          className="flex items-center justify-center gap-2 text-xs font-medium text-primary-dark bg-primary/10 hover:bg-primary/20 dark:bg-white/5 dark:hover:bg-white/10 dark:text-primary rounded-xl py-2 transition-colors"
        >
          <Eye size={14} />
          {showAddPreview ? 'Sembunyikan Preview' : 'Lihat Preview'}
        </button>
        {showAddPreview && <ContentPreview tipe={newContent.tipe} url={newContent.payload_url} />}
        <button
          type="submit"
          disabled={submitting}
          className="mt-2 bg-primary hover:bg-primary-dark disabled:opacity-60 text-white font-medium py-2.5 rounded-xl transition-colors"
        >
          {submitting ? 'Menyimpan...' : 'Simpan Konten'}
        </button>
      </form>
    </CustomModal>
  );
}
