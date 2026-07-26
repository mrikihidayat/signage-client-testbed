import { CustomModal } from '../../../../components/CustomModal';

export default function ApprovePairingModal({
  open,
  onClose,
  approveTarget,
  approveForm,
  setApproveForm,
  unpairedDevices,
  onSubmit,
  submitting,
}) {
  const hasUnpairedDevices = unpairedDevices.length > 0;

  return (
    <CustomModal open={open} onClose={onClose} title={`Setujui Pairing - ${approveTarget?.code || ''}`}>
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <div>
          <label className="text-xs font-medium text-secondary dark:text-slate-300 mb-1.5 block">
            Pilih Device (TV)
          </label>
          <select
            value={approveForm.deviceId}
            onChange={(e) => setApproveForm({ ...approveForm, deviceId: e.target.value })}
            disabled={!hasUnpairedDevices}
            className="w-full px-3 py-2.5 rounded-xl border border-secondary/15 dark:border-slate-600 bg-bgmint-light dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm text-inktext dark:text-slate-100 disabled:opacity-60"
          >
            <option value="">Pilih device...</option>
            {unpairedDevices.map((d) => (
              <option key={d.id} value={d.id}>
                {d.nama} — {d.lokasi}
              </option>
            ))}
          </select>
          {!hasUnpairedDevices && (
            <p className="text-xs text-inktext-muted dark:text-slate-400 mt-1.5">
              Semua device sudah dipasangkan. Tambahkan device baru di tab Devices terlebih dahulu.
            </p>
          )}
        </div>
        <button
          type="submit"
          disabled={submitting || !hasUnpairedDevices}
          className="mt-2 bg-primary hover:bg-primary-dark disabled:opacity-60 text-white font-medium py-2.5 rounded-xl transition-colors"
        >
          {submitting ? 'Memasangkan...' : 'Setujui & Pasangkan'}
        </button>
      </form>
    </CustomModal>
  );
}
