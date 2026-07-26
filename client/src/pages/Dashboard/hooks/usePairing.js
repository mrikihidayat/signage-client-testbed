import { useCallback, useEffect, useMemo, useState } from 'react';
import api from '../../../api/axios';

export default function usePairing({ toast, setSubmitting, fetchDevices, devices = [] }) {
  const [pairings, setPairings] = useState([]);
  const [approveModalOpen, setApproveModalOpen] = useState(false);
  const [approveTarget, setApproveTarget] = useState(null);
  const [approveForm, setApproveForm] = useState({ deviceId: '' });

  const fetchPairings = useCallback(async () => {
    try {
      const res = await api.get('/pairing');
      setPairings(res.data.pairings);
    } catch (err) {
      toast.error('Gagal memuat daftar pairing.');
    }
  }, []);

  useEffect(() => {
    fetchPairings();
  }, [fetchPairings]);

  const openApproveModal = (pairing) => {
    setApproveTarget(pairing);
    setApproveForm({ deviceId: '' });
    setApproveModalOpen(true);
  };

  const handleApprovePairing = async (e) => {
    e.preventDefault();
    if (!approveForm.deviceId) {
      toast.warning('Pilih device tujuan terlebih dahulu.');
      return;
    }
    setSubmitting(true);
    try {
      await api.post(`/pairing/${approveTarget.id}/approve`, approveForm);
      toast.success('Device berhasil dipasangkan.');
      setApproveModalOpen(false);
      fetchPairings();
      fetchDevices();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal menyetujui pairing.');
    } finally {
      setSubmitting(false);
    }
  };

  const rejectPairing = async (pairId) => {
    try {
      await api.post(`/pairing/${pairId}/reject`);
      toast.success('Kode pairing ditolak.');
      fetchPairings();
    } catch (err) {
      toast.error('Gagal menolak pairing.');
    }
  };

  const unpairedDevices = useMemo(() => devices.filter((d) => !d.paired), [devices]);

  return {
    pairings,
    setPairings,
    fetchPairings,
    approveModalOpen,
    setApproveModalOpen,
    approveTarget,
    approveForm,
    setApproveForm,
    unpairedDevices,
    openApproveModal,
    handleApprovePairing,
    rejectPairing,
  };
}
