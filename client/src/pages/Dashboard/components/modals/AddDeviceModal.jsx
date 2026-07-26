import { CustomModal } from '../../../../components/CustomModal';

export default function AddDeviceModal({ open, onClose, newDevice, setNewDevice, onSubmit, submitting }) {
  return (
    <CustomModal open={open} onClose={onClose} title="Tambah Device Baru">
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <div>
          <label className="text-xs font-medium text-secondary dark:text-slate-300 mb-1.5 block">Nama Device</label>
          <input
            type="text"
            value={newDevice.nama}
            onChange={(e) => setNewDevice({ ...newDevice, nama: e.target.value })}
            placeholder="Contoh: TV Lobby Utama"
            className="w-full px-3 py-2.5 rounded-xl border border-secondary/15 dark:border-slate-600 bg-bgmint-light dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm text-inktext dark:text-slate-100"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-secondary dark:text-slate-300 mb-1.5 block">Lokasi</label>
          <input
            type="text"
            value={newDevice.lokasi}
            onChange={(e) => setNewDevice({ ...newDevice, lokasi: e.target.value })}
            placeholder="Contoh: Lantai 1 - Lobby"
            className="w-full px-3 py-2.5 rounded-xl border border-secondary/15 dark:border-slate-600 bg-bgmint-light dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm text-inktext dark:text-slate-100"
          />
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="mt-2 bg-primary hover:bg-primary-dark disabled:opacity-60 text-white font-medium py-2.5 rounded-xl transition-colors"
        >
          {submitting ? 'Menyimpan...' : 'Simpan Device'}
        </button>
      </form>
    </CustomModal>
  );
}
