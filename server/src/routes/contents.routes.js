const express = require('express');
const supabase = require('../config/supabase');
const authenticateToken = require('../middleware/authenticateToken');
const { sendToDevice } = require('../realtime/connectionStore');
const { pushPlaylistIfActive } = require('../realtime/broadcast');

const router = express.Router();

router.get('/', authenticateToken, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('contents')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return res.json({ success: true, contents: data });
  } catch (err) {
    console.error('[GET /api/contents]', err.message);
    return res.status(500).json({ success: false, message: 'Gagal mengambil data konten.' });
  }
});

router.post('/', authenticateToken, async (req, res) => {
  try {
    const { judul, tipe, payload_url } = req.body;

    if (!judul || !tipe || !payload_url) {
      return res.status(400).json({ success: false, message: 'Judul, tipe, dan payload_url wajib diisi.' });
    }
    if (!['image', 'video', 'url'].includes(tipe)) {
      return res.status(400).json({ success: false, message: 'Tipe konten harus image, video, atau url.' });
    }

    const { data, error } = await supabase
      .from('contents')
      .insert({ judul, tipe, payload_url })
      .select()
      .single();

    if (error) throw error;

    return res.status(201).json({ success: true, message: 'Konten berhasil ditambahkan.', content: data });
  } catch (err) {
    console.error('[POST /api/contents]', err.message);
    return res.status(500).json({ success: false, message: 'Gagal menambahkan konten.' });
  }
});

router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { judul, tipe, payload_url } = req.body;

    if (!judul || !tipe || !payload_url) {
      return res.status(400).json({ success: false, message: 'Judul, tipe, dan payload_url wajib diisi.' });
    }
    if (!['image', 'video', 'url'].includes(tipe)) {
      return res.status(400).json({ success: false, message: 'Tipe konten harus image, video, atau url.' });
    }

    const { data, error } = await supabase
      .from('contents')
      .update({ judul, tipe, payload_url })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    if (!data) {
      return res.status(404).json({ success: false, message: 'Konten tidak ditemukan.' });
    }

    try {
      const { data: affectedDevices } = await supabase
        .from('devices')
        .select('id')
        .eq('current_content_id', id);

      if (affectedDevices) {
        for (const dev of affectedDevices) {
          sendToDevice(dev.id, { type: 'push_content', content: data });
        }
      }
    } catch (pushErr) {
      console.error('[PUT /api/contents/:id] gagal re-push ke device aktif:', pushErr.message);
    }

    try {
      const { data: affectedPlaylists } = await supabase
        .from('playlist_items')
        .select('device_id')
        .eq('content_id', id);

      if (affectedPlaylists && affectedPlaylists.length > 0) {
        const uniqueDeviceIds = [...new Set(affectedPlaylists.map((row) => row.device_id))];
        await Promise.all(uniqueDeviceIds.map((devId) => pushPlaylistIfActive(devId)));
      }
    } catch (pushErr) {
      console.error('[PUT /api/contents/:id] gagal re-push playlist aktif:', pushErr.message);
    }

    return res.json({ success: true, message: 'Konten berhasil diperbarui.', content: data });
  } catch (err) {
    console.error('[PUT /api/contents/:id]', err.message);
    return res.status(500).json({ success: false, message: 'Gagal memperbarui konten.' });
  }
});

router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const { data: affectedPlaylists } = await supabase
      .from('playlist_items')
      .select('device_id')
      .eq('content_id', id);

    const { error } = await supabase.from('contents').delete().eq('id', id);
    if (error) throw error;

    if (affectedPlaylists && affectedPlaylists.length > 0) {
      const uniqueDeviceIds = [...new Set(affectedPlaylists.map((row) => row.device_id))];
      Promise.all(uniqueDeviceIds.map((devId) => pushPlaylistIfActive(devId))).catch((err) =>
        console.error('[DELETE /api/contents/:id] gagal re-push playlist aktif:', err.message)
      );
    }

    return res.json({ success: true, message: 'Konten berhasil dihapus.' });
  } catch (err) {
    console.error('[DELETE /api/contents/:id]', err.message);
    return res.status(500).json({ success: false, message: 'Gagal menghapus konten.' });
  }
});

module.exports = router;
