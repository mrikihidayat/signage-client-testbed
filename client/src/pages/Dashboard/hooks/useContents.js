import { useCallback, useEffect, useState } from 'react';
import api from '../../../api/axios';

export default function useContents({ toast, setConfirmState, submitting, setSubmitting, fetchDevices }) {
  const [contents, setContents] = useState([]);
  const [contentSearch, setContentSearch] = useState('');
  const [contentModalOpen, setContentModalOpen] = useState(false);
  const [editContentModalOpen, setEditContentModalOpen] = useState(false);
  const [newContent, setNewContent] = useState({ judul: '', tipe: 'image', payload_url: '' });
  const [showAddPreview, setShowAddPreview] = useState(false);
  const [editContent, setEditContent] = useState({ id: '', judul: '', tipe: 'image', payload_url: '' });

  const fetchContents = useCallback(async () => {
    try {
      const res = await api.get('/contents');
      setContents(res.data.contents);
    } catch (err) {
      toast.error('Gagal memuat data konten.');
    }
  }, []);

  useEffect(() => {
    fetchContents();
  }, [fetchContents]);

  const closeAddContentModal = () => {
    setContentModalOpen(false);
    setShowAddPreview(false);
  };

  const handleAddContent = async (e) => {
    e.preventDefault();
    if (!newContent.judul || !newContent.payload_url) {
      toast.warning('Judul dan URL konten wajib diisi.');
      return;
    }
    setSubmitting(true);
    try {
      await api.post('/contents', newContent);
      toast.success('Konten berhasil ditambahkan.');
      setContentModalOpen(false);
      setNewContent({ judul: '', tipe: 'image', payload_url: '' });
      fetchContents();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal menambahkan konten.');
    } finally {
      setSubmitting(false);
    }
  };

  const openEditContent = (c) => {
    setEditContent({ id: c.id, judul: c.judul, tipe: c.tipe, payload_url: c.payload_url });
    setEditContentModalOpen(true);
  };

  const handleEditContent = async (e) => {
    e.preventDefault();
    if (!editContent.judul || !editContent.payload_url) {
      toast.warning('Judul dan URL konten wajib diisi.');
      return;
    }
    setSubmitting(true);
    try {
      await api.put(`/contents/${editContent.id}`, {
        judul: editContent.judul,
        tipe: editContent.tipe,
        payload_url: editContent.payload_url,
      });
      toast.success('Konten berhasil diperbarui.');
      setEditContentModalOpen(false);
      fetchContents();
      fetchDevices();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal memperbarui konten.');
    } finally {
      setSubmitting(false);
    }
  };

  const askDeleteContent = (id, judul) => {
    setConfirmState({
      open: true,
      message: `Konten "${judul}" akan dihapus permanen. Lanjutkan?`,
      onConfirm: async () => {
        try {
          await api.delete(`/contents/${id}`);
          toast.success('Konten berhasil dihapus.');
          fetchContents();
        } catch (err) {
          toast.error('Gagal menghapus konten.');
        }
      },
    });
  };

  const filteredContents = contents.filter((c) => {
    const q = contentSearch.trim().toLowerCase();
    if (!q) return true;
    return (
      c.judul.toLowerCase().includes(q) ||
      c.tipe.toLowerCase().includes(q) ||
      c.payload_url.toLowerCase().includes(q)
    );
  });

  return {
    contents,
    fetchContents,
    contentSearch,
    setContentSearch,
    filteredContents,
    contentModalOpen,
    setContentModalOpen,
    closeAddContentModal,
    newContent,
    setNewContent,
    showAddPreview,
    setShowAddPreview,
    handleAddContent,
    editContentModalOpen,
    setEditContentModalOpen,
    editContent,
    setEditContent,
    openEditContent,
    handleEditContent,
    askDeleteContent,
  };
}
