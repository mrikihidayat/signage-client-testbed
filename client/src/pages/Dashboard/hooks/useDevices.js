import { useCallback, useEffect, useState } from 'react';
import api from '../../../api/axios';

export default function useDevices({ toast, setConfirmState, submitting, setSubmitting }) {
  const [devices, setDevices] = useState([]);
  const [deviceSearch, setDeviceSearch] = useState('');
  const [deviceModalOpen, setDeviceModalOpen] = useState(false);
  const [editDeviceModalOpen, setEditDeviceModalOpen] = useState(false);
  const [newDevice, setNewDevice] = useState({ nama: '', lokasi: '' });
  const [editDevice, setEditDevice] = useState({ id: '', nama: '', lokasi: '' });

  const fetchDevices = useCallback(async () => {
    try {
      const res = await api.get('/devices');
      setDevices(res.data.devices);
    } catch (err) {
      toast.error('Gagal memuat data device.');
    }
  }, []);

  useEffect(() => {
    fetchDevices();
  }, [fetchDevices]);

  const handleAddDevice = async (e) => {
    e.preventDefault();
    if (!newDevice.nama || !newDevice.lokasi) {
      toast.warning('Nama dan lokasi device wajib diisi.');
      return;
    }
    setSubmitting(true);
    try {
      await api.post('/devices', newDevice);
      toast.success('Device berhasil ditambahkan.');
      setDeviceModalOpen(false);
      setNewDevice({ nama: '', lokasi: '' });
      fetchDevices();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal menambahkan device.');
    } finally {
      setSubmitting(false);
    }
  };

  const openEditDevice = (d) => {
    setEditDevice({ id: d.id, nama: d.nama, lokasi: d.lokasi });
    setEditDeviceModalOpen(true);
  };

  const handleEditDevice = async (e) => {
    e.preventDefault();
    if (!editDevice.nama || !editDevice.lokasi) {
      toast.warning('Nama dan lokasi device wajib diisi.');
      return;
    }
    setSubmitting(true);
    try {
      await api.put(`/devices/${editDevice.id}`, {
        nama: editDevice.nama,
        lokasi: editDevice.lokasi,
      });
      toast.success('Device berhasil diperbarui.');
      setEditDeviceModalOpen(false);
      fetchDevices();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal memperbarui device.');
    } finally {
      setSubmitting(false);
    }
  };

  const askDeleteDevice = (id, nama) => {
    setConfirmState({
      open: true,
      message: `Device "${nama}" akan dihapus permanen. Lanjutkan?`,
      onConfirm: async () => {
        try {
          await api.delete(`/devices/${id}`);
          toast.success('Device berhasil dihapus.');
          fetchDevices();
        } catch (err) {
          toast.error('Gagal menghapus device.');
        }
      },
    });
  };

  const copyDeviceLink = async (device) => {
    const link = `${window.location.origin}/display/${device.id}?token=${device.ws_token}`;
    try {
      await navigator.clipboard.writeText(link);
      toast.success('Link display berhasil disalin ke clipboard.');
    } catch (err) {
      toast.error('Gagal menyalin link. Salin manual: ' + link);
    }
  };

  const filteredDevices = devices.filter((d) => {
    const q = deviceSearch.trim().toLowerCase();
    if (!q) return true;
    return d.nama.toLowerCase().includes(q) || d.lokasi.toLowerCase().includes(q);
  });

  const onlineCount = devices.filter((d) => d.status === 'online').length;
  const offlineCount = devices.length - onlineCount;

  return {
    devices,
    setDevices,
    fetchDevices,
    deviceSearch,
    setDeviceSearch,
    filteredDevices,
    onlineCount,
    offlineCount,
    deviceModalOpen,
    setDeviceModalOpen,
    newDevice,
    setNewDevice,
    handleAddDevice,
    editDeviceModalOpen,
    setEditDeviceModalOpen,
    editDevice,
    setEditDevice,
    openEditDevice,
    handleEditDevice,
    askDeleteDevice,
    copyDeviceLink,
  };
}
