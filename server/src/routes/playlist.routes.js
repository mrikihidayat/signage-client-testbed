const express = require('express');
const supabase = require('../config/supabase');
const authenticateToken = require('../middleware/authenticateToken');
const { sendToDevice } = require('../realtime/connectionStore');
const { broadcastToDashboards, pushPlaylistToDevice, pushPlaylistIfActive } = require('../realtime/broadcast');

const router = express.Router({ mergeParams: true });

async function getDeviceOr404(deviceId, res) {
  const { data, error } = await supabase.from('devices').select('*').eq('id', deviceId).maybeSingle();
  if (error) throw error;
  if (!data) {
    res.status(404).json({ success: false, message: 'Device tidak ditemukan.' });
    return null;
  }
  return data;
}

router.get('/', authenticateToken, async (req, res) => {
  try {
    const { deviceId } = req.params;
    if (!(await getDeviceOr404(deviceId, res))) return;

    const { data, error } = await supabase
      .from('playlist_items')
      .select('*, contents:content_id(*)')
      .eq('device_id', deviceId)
      .order('urutan', { ascending: true });

    if (error) throw error;

    return res.json({ success: true, items: data });
  } catch (err) {
    console.error('[GET /api/devices/:deviceId/playlist]', err.message);
    return res.status(500).json({ success: false, message: 'Gagal mengambil data playlist.' });
  }
});

router.post('/', authenticateToken, async (req, res) => {
  try {
    const { deviceId } = req.params;
    const { contentId, durasi_detik } = req.body;

    if (!(await getDeviceOr404(deviceId, res))) return;

    if (!contentId) {
      return res.status(400).json({ success: false, message: 'contentId wajib diisi.' });
    }

    const { data: content, error: contentError } = await supabase
      .from('contents')
      .select('id')
      .eq('id', contentId)
      .maybeSingle();
    if (contentError) throw contentError;
    if (!content) {
      return res.status(404).json({ success: false, message: 'Konten tidak ditemukan.' });
    }

    const durasi = Number.isFinite(Number(durasi_detik)) && Number(durasi_detik) > 0 ? Math.round(Number(durasi_detik)) : 10;

    const { data: last } = await supabase
      .from('playlist_items')
      .select('urutan')
      .eq('device_id', deviceId)
      .order('urutan', { ascending: false })
      .limit(1);

    const nextUrutan = last && last.length > 0 ? last[0].urutan + 1 : 0;

    const { data, error } = await supabase
      .from('playlist_items')
      .insert({ device_id: deviceId, content_id: contentId, urutan: nextUrutan, durasi_detik: durasi })
      .select('*, contents:content_id(*)')
      .single();

    if (error) throw error;

    await pushPlaylistIfActive(deviceId);

    return res.status(201).json({ success: true, message: 'Konten ditambahkan ke playlist.', item: data });
  } catch (err) {
    console.error('[POST /api/devices/:deviceId/playlist]', err.message);
    return res.status(500).json({ success: false, message: 'Gagal menambahkan konten ke playlist.' });
  }
});

router.put('/reorder', authenticateToken, async (req, res) => {
  try {
    const { deviceId } = req.params;
    const { order } = req.body;

    if (!(await getDeviceOr404(deviceId, res))) return;

    if (!Array.isArray(order) || order.length === 0) {
      return res.status(400).json({ success: false, message: 'order (array id playlist item) wajib diisi.' });
    }

    await Promise.all(
      order.map((itemId, index) =>
        supabase.from('playlist_items').update({ urutan: index }).eq('id', itemId).eq('device_id', deviceId)
      )
    );

    const { data, error } = await supabase
      .from('playlist_items')
      .select('*, contents:content_id(*)')
      .eq('device_id', deviceId)
      .order('urutan', { ascending: true });

    if (error) throw error;

    await pushPlaylistIfActive(deviceId);

    return res.json({ success: true, message: 'Urutan playlist berhasil diperbarui.', items: data });
  } catch (err) {
    console.error('[PUT /api/devices/:deviceId/playlist/reorder]', err.message);
    return res.status(500).json({ success: false, message: 'Gagal mengubah urutan playlist.' });
  }
});

router.put('/:itemId', authenticateToken, async (req, res) => {
  try {
    const { deviceId, itemId } = req.params;
    const { durasi_detik } = req.body;

    if (!(await getDeviceOr404(deviceId, res))) return;

    if (!Number.isFinite(Number(durasi_detik)) || Number(durasi_detik) <= 0) {
      return res.status(400).json({ success: false, message: 'durasi_detik harus berupa angka lebih dari 0.' });
    }

    const { data, error } = await supabase
      .from('playlist_items')
      .update({ durasi_detik: Math.round(Number(durasi_detik)) })
      .eq('id', itemId)
      .eq('device_id', deviceId)
      .select('*, contents:content_id(*)')
      .single();

    if (error) throw error;
    if (!data) {
      return res.status(404).json({ success: false, message: 'Item playlist tidak ditemukan.' });
    }

    await pushPlaylistIfActive(deviceId);

    return res.json({ success: true, message: 'Durasi item playlist berhasil diperbarui.', item: data });
  } catch (err) {
    console.error('[PUT /api/devices/:deviceId/playlist/:itemId]', err.message);
    return res.status(500).json({ success: false, message: 'Gagal memperbarui item playlist.' });
  }
});

router.delete('/:itemId', authenticateToken, async (req, res) => {
  try {
    const { deviceId, itemId } = req.params;

    if (!(await getDeviceOr404(deviceId, res))) return;

    const { error } = await supabase.from('playlist_items').delete().eq('id', itemId).eq('device_id', deviceId);
    if (error) throw error;

    await pushPlaylistIfActive(deviceId);

    return res.json({ success: true, message: 'Item playlist berhasil dihapus.' });
  } catch (err) {
    console.error('[DELETE /api/devices/:deviceId/playlist/:itemId]', err.message);
    return res.status(500).json({ success: false, message: 'Gagal menghapus item playlist.' });
  }
});

router.post('/activate', authenticateToken, async (req, res) => {
  try {
    const { deviceId } = req.params;
    if (!(await getDeviceOr404(deviceId, res))) return;

    const { data: items, error: itemsError } = await supabase
      .from('playlist_items')
      .select('*, contents:content_id(*)')
      .eq('device_id', deviceId)
      .order('urutan', { ascending: true });

    if (itemsError) throw itemsError;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Playlist masih kosong. Tambahkan minimal 1 konten dahulu.' });
    }

    const { data: updatedDevice, error: deviceError } = await supabase
      .from('devices')
      .update({ mode: 'playlist' })
      .eq('id', deviceId)
      .select('*, contents:current_content_id(*)')
      .single();

    if (deviceError) throw deviceError;

    pushPlaylistToDevice(deviceId, items);
    broadcastToDashboards({ type: 'device_updated', deviceId, device: updatedDevice });

    return res.json({ success: true, message: 'Mode playlist diaktifkan untuk device ini.', device: updatedDevice });
  } catch (err) {
    console.error('[POST /api/devices/:deviceId/playlist/activate]', err.message);
    return res.status(500).json({ success: false, message: 'Gagal mengaktifkan playlist.' });
  }
});

router.post('/deactivate', authenticateToken, async (req, res) => {
  try {
    const { deviceId } = req.params;
    if (!(await getDeviceOr404(deviceId, res))) return;

    const { data: updatedDevice, error: deviceError } = await supabase
      .from('devices')
      .update({ mode: 'single' })
      .eq('id', deviceId)
      .select('*, contents:current_content_id(*)')
      .single();

    if (deviceError) throw deviceError;

    sendToDevice(deviceId, { type: 'push_content', content: updatedDevice.contents || null });
    broadcastToDashboards({ type: 'device_updated', deviceId, device: updatedDevice });

    return res.json({ success: true, message: 'Mode playlist dinonaktifkan, kembali ke konten tunggal.', device: updatedDevice });
  } catch (err) {
    console.error('[POST /api/devices/:deviceId/playlist/deactivate]', err.message);
    return res.status(500).json({ success: false, message: 'Gagal menonaktifkan playlist.' });
  }
});

module.exports = router;
