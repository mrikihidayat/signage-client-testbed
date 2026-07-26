import { CustomModal } from '../../../../components/CustomModal';

export default function EditDeviceModal({ open, onClose, editDevice, setEditDevice, onSubmit, submitting }) {
  return (
    <CustomModal open={open} onClose={onClose} title="Edit Device">
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <div>
          <label className="text-xs font-medium text-secondary dark:text-slate-300 mb-1.5 block">Nama Device</label>
          <input
            type="text"
            value={editDevice.nama}
            onChange={(e) => setEditDevice({ ...editDevice, nama: e.target.value })}
            className="w-full px-3 py-2.5 rounded-xl border border-secondary/15 dark:border-slate-600 bg-bgmint-light dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm text-inktext dark:text-slate-100"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-secondary dark:text-slate-300 mb-1.5 block">Lokasi</label>
          <input
            type="text"
            value={editDevice.lokasi}
            onChange={(e) => setEditDevice({ ...editDevice, lokasi: e.target.value })}
            className="w-full px-3 py-2.5 rounded-xl border border-secondary/15 dark:border-slate-600 bg-bgmint-light dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm text-inktext dark:text-slate-100"
          />
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
