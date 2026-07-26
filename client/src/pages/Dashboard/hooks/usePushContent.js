import { useState } from 'react';
import api from '../../../api/axios';

export default function usePushContent({ toast, submitting, setSubmitting, fetchDevices }) {
  const [pushModalOpen, setPushModalOpen] = useState(false);
  const [pushTarget, setPushTarget] = useState({ deviceId: '', contentId: '' });

  const openPushModal = (deviceId) => {
    setPushTarget({ deviceId: deviceId || '', contentId: '' });
    setPushModalOpen(true);
  };

  const handlePushContent = async (e) => {
    e.preventDefault();
    if (!pushTarget.deviceId || !pushTarget.contentId) {
      toast.warning('Pilih device dan konten terlebih dahulu.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await api.post('/push-content', pushTarget);
      toast.success(res.data.message);
      setPushModalOpen(false);
      fetchDevices();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal push konten.');
    } finally {
      setSubmitting(false);
    }
  };

  return {
    pushModalOpen,
    setPushModalOpen,
    pushTarget,
    setPushTarget,
    openPushModal,
    handlePushContent,
  };
}
