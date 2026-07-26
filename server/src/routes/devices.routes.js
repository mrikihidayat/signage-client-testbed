const express = require('express');
const supabase = require('../config/supabase');
const authenticateToken = require('../middleware/authenticateToken');
const { broadcastToDashboards } = require('../realtime/broadcast');
const { closeDeviceConnections } = require('../realtime/connectionStore');

const router = express.Router();

router.get('/', authenticateToken, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('devices')
      .select('*, contents:current_content_id(*)')
      .order('nama', { ascending: true });

    if (error) throw error;

    return res.json({ success: true, devices: data });
  } catch (err) {
    console.error('[GET /api/devices]', err.message);
    return res.status(500).json({ success: false, message: 'Gagal mengambil data device.' });
  }
});

router.post('/', authenticateToken, async (req, res) => {
  try {
    const { nama, lokasi } = req.body;

    if (!nama || !lokasi) {
      return res.status(400).json({ success: false, message: 'Nama dan lokasi device wajib diisi.' });
    }

    const { data, error } = await supabase
      .from('devices')
      .insert({ nama, lokasi, status: 'offline', paired: false })
      .select()
      .single();

    if (error) throw error;

    broadcastToDashboards({ type: 'device_created', device: data });

    return res.status(201).json({ success: true, message: 'Device berhasil ditambahkan.', device: data });
  } catch (err) {
    console.error('[POST /api/devices]', err.message);
    return res.status(500).json({ success: false, message: 'Gagal menambahkan device.' });
  }
});

router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { nama, lokasi } = req.body;

    if (!nama || !lokasi) {
      return res.status(400).json({ success: false, message: 'Nama dan lokasi device wajib diisi.' });
    }

    const { data, error } = await supabase
      .from('devices')
      .update({ nama, lokasi })
      .eq('id', id)
      .select('*, contents:current_content_id(*)')
      .single();

    if (error) throw error;
    if (!data) {
      return res.status(404).json({ success: false, message: 'Device tidak ditemukan.' });
    }

    broadcastToDashboards({ type: 'device_updated', deviceId: id, device: data });

    return res.json({ success: true, message: 'Device berhasil diperbarui.', device: data });
  } catch (err) {
    console.error('[PUT /api/devices/:id]', err.message);
    return res.status(500).json({ success: false, message: 'Gagal memperbarui device.' });
  }
});

router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    closeDeviceConnections(id, 1000, 'Device dihapus oleh admin');

    const { error } = await supabase.from('devices').delete().eq('id', id);
    if (error) throw error;

    broadcastToDashboards({ type: 'device_deleted', deviceId: id });

    return res.json({ success: true, message: 'Device berhasil dihapus.' });
  } catch (err) {
    console.error('[DELETE /api/devices/:id]', err.message);
    return res.status(500).json({ success: false, message: 'Gagal menghapus device.' });
  }
});

module.exports = router;
