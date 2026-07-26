import { useEffect, useState } from 'react';

export default function ContentPreview({ tipe, url }) {
  const [error, setError] = useState(false);

  useEffect(() => {
    setError(false);
  }, [url, tipe]);

  if (!url) {
    return (
      <div className="w-full h-40 rounded-xl border border-dashed border-secondary/20 dark:border-slate-600 bg-bgmint-light dark:bg-slate-900 flex items-center justify-center text-xs text-inktext-muted dark:text-slate-500">
        Masukkan URL untuk melihat preview
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-40 rounded-xl border border-dashed border-red-300 dark:border-red-500/40 bg-red-50 dark:bg-red-500/10 flex items-center justify-center text-xs text-red-500 text-center px-4">
        Preview gagal dimuat. Periksa kembali URL-nya.
      </div>
    );
  }

  if (tipe === 'image') {
    return (
      <div className="w-full h-40 rounded-xl overflow-hidden border border-secondary/15 dark:border-slate-600 bg-bgmint-light dark:bg-slate-900">
        <img
          src={url}
          alt="Preview konten"
          className="w-full h-full object-contain"
          onError={() => setError(true)}
        />
      </div>
    );
  }

  if (tipe === 'video') {
    return (
      <div className="w-full h-40 rounded-xl overflow-hidden border border-secondary/15 dark:border-slate-600 bg-black">
        <video src={url} controls className="w-full h-full" onError={() => setError(true)} />
      </div>
    );
  }

  return (
    <div className="w-full h-40 rounded-xl overflow-hidden border border-secondary/15 dark:border-slate-600 bg-white dark:bg-slate-900">
      <iframe title="Preview konten" src={url} className="w-full h-full" onError={() => setError(true)} />
    </div>
  );
}
