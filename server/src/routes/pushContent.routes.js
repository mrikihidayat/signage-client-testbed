const express = require('express');
const supabase = require('../config/supabase');
const authenticateToken = require('../middleware/authenticateToken');
const { sendToDevice } = require('../realtime/connectionStore');
const { broadcastToDashboards } = require('../realtime/broadcast');

const router = express.Router();

router.post('/', authenticateToken, async (req, res) => {
  try {
    const { deviceId, contentId } = req.body;

    if (!deviceId || !contentId) {
      return res.status(400).json({ success: false, message: 'deviceId dan contentId wajib diisi.' });
    }

    const { data: content, error: contentError } = await supabase
      .from('contents')
      .select('*')
      .eq('id', contentId)
      .single();

    if (contentError || !content) {
      return res.status(404).json({ success: false, message: 'Konten tidak ditemukan.' });
    }

    const { data: updatedDevice, error: deviceError } = await supabase
      .from('devices')
      .update({ current_content_id: contentId, mode: 'single' })
      .eq('id', deviceId)
      .select('*, contents:current_content_id(*)')
      .single();

    if (deviceError) throw deviceError;

    const sentRealtime = sendToDevice(deviceId, { type: 'push_content', content });

    broadcastToDashboards({
      type: 'content_pushed',
      deviceId,
      device: updatedDevice,
    });

    return res.json({
      success: true,
      message: sentRealtime
        ? 'Konten berhasil dikirim ke device secara real-time.'
        : 'Konten disimpan, namun device sedang offline. Akan tampil saat device online kembali.',
      device: updatedDevice,
    });
  } catch (err) {
    console.error('[POST /api/push-content]', err.message);
    return res.status(500).json({ success: false, message: 'Gagal push konten ke device.' });
  }
});

module.exports = router;
