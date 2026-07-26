import { Send } from 'lucide-react';
import { CustomModal } from '../../../../components/CustomModal';

export default function PushContentModal({
  open,
  onClose,
  devices,
  contents,
  pushTarget,
  setPushTarget,
  onSubmit,
  submitting,
}) {
  return (
    <CustomModal open={open} onClose={onClose} title="Push Content ke Device">
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <div>
          <label className="text-xs font-medium text-secondary dark:text-slate-300 mb-1.5 block">Pilih Device</label>
          <select
            value={pushTarget.deviceId}
            onChange={(e) => setPushTarget({ ...pushTarget, deviceId: e.target.value })}
            className="w-full px-3 py-2.5 rounded-xl border border-secondary/15 dark:border-slate-600 bg-bgmint-light dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm text-inktext dark:text-slate-100"
          >
            <option value="">-- Pilih Device --</option>
            {devices.map((d) => (
              <option key={d.id} value={d.id}>
                {d.nama} ({d.status})
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs font-medium text-secondary dark:text-slate-300 mb-1.5 block">Pilih Konten</label>
          <select
            value={pushTarget.contentId}
            onChange={(e) => setPushTarget({ ...pushTarget, contentId: e.target.value })}
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
        <button
          type="submit"
          disabled={submitting}
          className="mt-2 flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark disabled:opacity-60 text-white font-medium py-2.5 rounded-xl transition-colors"
        >
          <Send size={16} />
          {submitting ? 'Mengirim...' : 'Kirim Sekarang'}
        </button>
      </form>
    </CustomModal>
  );
}
