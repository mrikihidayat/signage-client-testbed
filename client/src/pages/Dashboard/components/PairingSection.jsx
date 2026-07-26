import { Check, KeyRound, X } from 'lucide-react';

export default function PairingSection({ pairings, onApprove, onReject }) {
  return (
    <section className="bg-white dark:bg-slate-800 rounded-2xl shadow-card overflow-hidden transition-colors">
      <div className="flex items-center justify-between px-6 py-4 border-b border-secondary/10 dark:border-white/10">
        <h2 className="font-semibold text-secondary dark:text-white">Permintaan Pairing Device</h2>
        <span className="text-xs text-inktext-muted dark:text-slate-400">
          {pairings.length} menunggu persetujuan
        </span>
      </div>

      <div className="overflow-x-auto scrollbar-thin">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-inktext-muted dark:text-slate-400 uppercase bg-bgmint-light dark:bg-slate-900">
              <th className="px-6 py-3 font-medium">Kode Pairing</th>
              <th className="px-6 py-3 font-medium">Diminta Pada</th>
              <th className="px-6 py-3 font-medium text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {pairings.length === 0 && (
              <tr>
                <td colSpan={3} className="px-6 py-10 text-center text-inktext-muted dark:text-slate-400">
                  Belum ada layar yang meminta pairing. Nyalakan aplikasi desktop di layar untuk memunculkan kode di sini.
                </td>
              </tr>
            )}
            {pairings.map((p) => (
              <tr
                key={p.id}
                className="border-t border-secondary/5 dark:border-white/5 hover:bg-bgmint-light/60 dark:hover:bg-white/5 transition-colors"
              >
                <td className="px-6 py-3.5 font-medium text-inktext dark:text-slate-100">
                  <span className="inline-flex items-center gap-2 font-mono text-base tracking-[0.3em]">
                    <KeyRound size={16} className="text-primary" />
                    {p.code}
                  </span>
                </td>
                <td className="px-6 py-3.5 text-inktext-muted dark:text-slate-400">
                  {new Date(p.created_at).toLocaleTimeString('id-ID')}
                </td>
                <td className="px-6 py-3.5">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => onApprove(p)}
                      className="p-1.5 rounded-lg text-primary-dark hover:bg-primary/10 transition-colors"
                      title="Setujui & Pasangkan"
                    >
                      <Check size={16} />
                    </button>
                    <button
                      onClick={() => onReject(p.id)}
                      className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                      title="Tolak"
                    >
                      <X size={16} />
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
