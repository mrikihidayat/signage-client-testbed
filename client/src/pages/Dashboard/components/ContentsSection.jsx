import { Image, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { TYPE_ICONS } from '../constants';

export default function ContentsSection({
  contents,
  filteredContents,
  contentSearch,
  setContentSearch,
  onAddClick,
  onEditClick,
  onDeleteClick,
}) {
  return (
    <section className="bg-white dark:bg-slate-800 rounded-2xl shadow-card overflow-hidden transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 py-4 border-b border-secondary/10 dark:border-white/10">
        <h2 className="font-semibold text-secondary dark:text-white">Manajemen Konten</h2>
        <div className="flex items-center gap-2 flex-wrap justify-end">
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary/40" />
            <input
              type="text"
              value={contentSearch}
              onChange={(e) => setContentSearch(e.target.value)}
              placeholder="Cari judul / tipe / url..."
              className="pl-9 pr-3 py-1.5 rounded-lg border border-secondary/15 dark:border-slate-600 bg-bgmint-light dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm w-52 text-inktext dark:text-slate-100"
            />
          </div>
          <button
            onClick={onAddClick}
            className="flex items-center gap-1.5 text-sm font-medium text-primary-dark bg-primary/10 hover:bg-primary/20 px-3 py-1.5 rounded-lg transition-colors shrink-0"
          >
            <Plus size={16} />
            Tambah Konten
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
        {filteredContents.length === 0 && (
          <p className="col-span-full text-center text-inktext-muted dark:text-slate-400 py-8">
            {contents.length === 0
              ? 'Belum ada konten. Tambahkan konten pertama Anda.'
              : 'Tidak ada konten yang cocok dengan pencarian.'}
          </p>
        )}
        {filteredContents.map((c) => {
          const Icon = TYPE_ICONS[c.tipe] || Image;
          return (
            <div
              key={c.id}
              className="border border-secondary/10 dark:border-white/10 rounded-xl p-4 flex flex-col gap-2 hover:shadow-card transition-shadow"
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary-dark flex items-center justify-center shrink-0">
                  <Icon size={16} />
                </div>
                <p className="font-medium text-inktext dark:text-slate-100 text-sm truncate">{c.judul}</p>
              </div>
              <p className="text-xs text-inktext-muted dark:text-slate-400 truncate">{c.payload_url}</p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-[11px] uppercase tracking-wide text-secondary/60 dark:text-slate-400 bg-secondary/5 dark:bg-white/5 px-2 py-0.5 rounded-full">
                  {c.tipe}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onEditClick(c)}
                    className="p-1.5 rounded-lg text-secondary hover:bg-secondary/10 transition-colors"
                    title="Edit Konten"
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    onClick={() => onDeleteClick(c.id, c.judul)}
                    className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                    title="Hapus Konten"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
