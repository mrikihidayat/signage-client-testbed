import { Eye } from 'lucide-react';
import { CustomModal } from '../../../../components/CustomModal';
import ContentPreview from '../ContentPreview';

export default function EditContentModal({ open, onClose, editContent, setEditContent, onSubmit, submitting }) {
  return (
    <CustomModal open={open} onClose={onClose} title="Edit Konten">
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <div>
          <label className="text-xs font-medium text-secondary dark:text-slate-300 mb-1.5 block">Judul Konten</label>
          <input
            type="text"
            value={editContent.judul}
            onChange={(e) => setEditContent({ ...editContent, judul: e.target.value })}
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
                onClick={() => setEditContent({ ...editContent, tipe: t })}
                className={`py-2 rounded-xl text-sm font-medium capitalize border transition-colors ${
                  editContent.tipe === t
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
            {editContent.tipe === 'url' ? 'URL Halaman' : 'URL File'}
          </label>
          <input
            type="text"
            value={editContent.payload_url}
            onChange={(e) => setEditContent({ ...editContent, payload_url: e.target.value })}
            className="w-full px-3 py-2.5 rounded-xl border border-secondary/15 dark:border-slate-600 bg-bgmint-light dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm text-inktext dark:text-slate-100"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-secondary dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
            <Eye size={13} />
            Preview
          </label>
          <ContentPreview tipe={editContent.tipe} url={editContent.payload_url} />
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="mt-2 bg-primary hover:bg-primary-dark disabled:opacity-60 text-white font-medium py-2.5 rounded-xl transition-colors"
        >
          {submitting ? 'Menyimpan...' : 'Simpan Perubahan'}
        </button>
      </form>
    </CustomModal>
  );
}
