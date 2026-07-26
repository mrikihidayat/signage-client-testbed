import { useState } from 'react';
import api from '../../../api/axios';

export default function usePlaylist({ toast, submitting, setSubmitting, fetchDevices }) {
  const [playlistModalOpen, setPlaylistModalOpen] = useState(false);
  const [playlistDevice, setPlaylistDevice] = useState(null);
  const [playlistItems, setPlaylistItems] = useState([]);
  const [playlistLoading, setPlaylistLoading] = useState(false);
  const [newPlaylistItem, setNewPlaylistItem] = useState({ contentId: '', durasi_detik: 10 });

  const fetchPlaylistItems = async (deviceId) => {
    setPlaylistLoading(true);
    try {
      const res = await api.get(`/devices/${deviceId}/playlist`);
      setPlaylistItems(res.data.items);
    } catch (err) {
      toast.error('Gagal memuat playlist.');
    } finally {
      setPlaylistLoading(false);
    }
  };

  const openPlaylistModal = (device) => {
    setPlaylistDevice(device);
    setNewPlaylistItem({ contentId: '', durasi_detik: 10 });
    setPlaylistModalOpen(true);
    fetchPlaylistItems(device.id);
  };

  const handleAddPlaylistItem = async (e) => {
    e.preventDefault();
    if (!newPlaylistItem.contentId) {
      toast.warning('Pilih konten untuk ditambahkan ke playlist.');
      return;
    }
    setSubmitting(true);
    try {
      await api.post(`/devices/${playlistDevice.id}/playlist`, newPlaylistItem);
      toast.success('Konten ditambahkan ke playlist.');
      setNewPlaylistItem({ contentId: '', durasi_detik: 10 });
      fetchPlaylistItems(playlistDevice.id);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal menambahkan konten ke playlist.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemovePlaylistItem = async (itemId) => {
    try {
      await api.delete(`/devices/${playlistDevice.id}/playlist/${itemId}`);
      toast.success('Item playlist dihapus.');
      fetchPlaylistItems(playlistDevice.id);
    } catch (err) {
      toast.error('Gagal menghapus item playlist.');
    }
  };

  const handleUpdatePlaylistDuration = async (itemId, durasi_detik) => {
    if (!Number.isFinite(durasi_detik) || durasi_detik <= 0) return;
    try {
      await api.put(`/devices/${playlistDevice.id}/playlist/${itemId}`, { durasi_detik });
    } catch (err) {
      toast.error('Gagal memperbarui durasi.');
      fetchPlaylistItems(playlistDevice.id);
    }
  };

  const handleMovePlaylistItem = async (index, direction) => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= playlistItems.length) return;

    const reordered = [...playlistItems];
    [reordered[index], reordered[targetIndex]] = [reordered[targetIndex], reordered[index]];
    setPlaylistItems(reordered);

    try {
      await api.put(`/devices/${playlistDevice.id}/playlist/reorder`, {
        order: reordered.map((it) => it.id),
      });
    } catch (err) {
      toast.error('Gagal mengubah urutan playlist.');
      fetchPlaylistItems(playlistDevice.id);
    }
  };

  const handleActivatePlaylist = async () => {
    setSubmitting(true);
    try {
      const res = await api.post(`/devices/${playlistDevice.id}/playlist/activate`);
      toast.success(res.data.message);
      setPlaylistDevice((prev) => (prev ? { ...prev, mode: 'playlist' } : prev));
      fetchDevices();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal mengaktifkan playlist.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeactivatePlaylist = async () => {
    setSubmitting(true);
    try {
      const res = await api.post(`/devices/${playlistDevice.id}/playlist/deactivate`);
      toast.success(res.data.message);
      setPlaylistDevice((prev) => (prev ? { ...prev, mode: 'single' } : prev));
      fetchDevices();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal menonaktifkan playlist.');
    } finally {
      setSubmitting(false);
    }
  };

  return {
    playlistModalOpen,
    setPlaylistModalOpen,
    playlistDevice,
    playlistItems,
    setPlaylistItems,
    playlistLoading,
    newPlaylistItem,
    setNewPlaylistItem,
    openPlaylistModal,
    handleAddPlaylistItem,
    handleRemovePlaylistItem,
    handleUpdatePlaylistDuration,
    handleMovePlaylistItem,
    handleActivatePlaylist,
    handleDeactivatePlaylist,
  };
}
