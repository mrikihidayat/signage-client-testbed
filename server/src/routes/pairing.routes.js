const express = require('express');
const supabase = require('../config/supabase');
const authenticateToken = require('../middleware/authenticateToken');
const { broadcastToDashboards } = require('../realtime/broadcast');

const router = express.Router();

function generateCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

async function findFreeCode() {
  let code = generateCode();
  let attempts = 0;

  while (attempts < 5) {
    const { data: existing } = await supabase
      .from('pairing_codes')
      .select('id')
      .eq('code', code)
      .eq('status', 'pending')
      .maybeSingle();

    if (!existing) return code;
    code = generateCode();
    attempts += 1;
  }

  return code;
}

router.post('/request', async (req, res) => {
  try {
    const code = await findFreeCode();

    const { data, error } = await supabase
      .from('pairing_codes')
      .insert({ code })
      .select()
      .single();

    if (error) throw error;

    broadcastToDashboards({ type: 'pairing_requested', pairing: data });

    return res.status(201).json({
      success: true,
      pairId: data.id,
      code: data.code,
      expiresAt: data.expires_at,
    });
  } catch (err) {
    console.error('[POST /api/pairing/request]', err.message);
    return res.status(500).json({ success: false, message: 'Gagal membuat kode pairing.' });
  }
});

router.get('/:pairId/status', async (req, res) => {
  try {
    const { pairId } = req.params;

    const { data, error } = await supabase
      .from('pairing_codes')
      .select('*')
      .eq('id', pairId)
      .maybeSingle();

    if (error) throw error;
    if (!data) {
      return res.status(404).json({ success: false, message: 'Kode pairing tidak ditemukan.' });
    }

    if (data.status === 'pending' && new Date(data.expires_at) < new Date()) {
      await supabase.from('pairing_codes').update({ status: 'expired' }).eq('id', pairId);
      return res.json({ success: true, status: 'expired' });
    }

    if (data.status === 'approved') {
      return res.json({
        success: true,
        status: 'approved',
        deviceId: data.device_id,
        wsToken: data.ws_token,
      });
    }

    return res.json({ success: true, status: data.status });
  } catch (err) {
    console.error('[GET /api/pairing/:pairId/status]', err.message);
    return res.status(500).json({ success: false, message: 'Gagal memeriksa status pairing.' });
  }
});

router.get('/', authenticateToken, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('pairing_codes')
      .select('*')
      .eq('status', 'pending')
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false });

    if (error) throw error;

    return res.json({ success: true, pairings: data });
  } catch (err) {
    console.error('[GET /api/pairing]', err.message);
    return res.status(500).json({ success: false, message: 'Gagal mengambil daftar pairing.' });
  }
});

router.post('/:pairId/approve', authenticateToken, async (req, res) => {
  try {
    const { pairId } = req.params;
    const { deviceId } = req.body;

    if (!deviceId) {
      return res.status(400).json({ success: false, message: 'Device tujuan wajib dipilih.' });
    }

    const { data: pairing, error: pairingError } = await supabase
      .from('pairing_codes')
      .select('*')
      .eq('id', pairId)
      .maybeSingle();

    if (pairingError) throw pairingError;
    if (!pairing || pairing.status !== 'pending') {
      return res.status(404).json({
        success: false,
        message: 'Kode pairing tidak ditemukan atau sudah tidak berlaku.',
      });
    }

    const { data: device, error: deviceError } = await supabase
      .from('devices')
      .select('*')
      .eq('id', deviceId)
      .maybeSingle();

    if (deviceError) throw deviceError;
    if (!device) {
      return res.status(404).json({ success: false, message: 'Device tidak ditemukan.' });
    }
    if (device.paired) {
      return res.status(409).json({ success: false, message: 'Device tersebut sudah dipasangkan ke layar lain.' });
    }

    const { data: updatedDevice, error: updateDeviceError } = await supabase
      .from('devices')
      .update({ paired: true })
      .eq('id', deviceId)
      .select()
      .single();

    if (updateDeviceError) throw updateDeviceError;

    const { data: updatedPairing, error: updateError } = await supabase
      .from('pairing_codes')
      .update({ status: 'approved', device_id: updatedDevice.id, ws_token: updatedDevice.ws_token })
      .eq('id', pairId)
      .select()
      .single();

    if (updateError) throw updateError;

    broadcastToDashboards({ type: 'device_updated', deviceId: updatedDevice.id, device: updatedDevice });
    broadcastToDashboards({ type: 'pairing_approved', pairing: updatedPairing });

    return res.json({ success: true, message: 'Device berhasil dipasangkan.', device: updatedDevice });
  } catch (err) {
    console.error('[POST /api/pairing/:pairId/approve]', err.message);
    return res.status(500).json({ success: false, message: 'Gagal menyetujui pairing.' });
  }
});

router.post('/:pairId/reject', authenticateToken, async (req, res) => {
  try {
    const { pairId } = req.params;

    const { error } = await supabase
      .from('pairing_codes')
      .update({ status: 'expired' })
      .eq('id', pairId);

    if (error) throw error;

    broadcastToDashboards({ type: 'pairing_rejected', pairId });

    return res.json({ success: true, message: 'Kode pairing ditolak.' });
  } catch (err) {
    console.error('[POST /api/pairing/:pairId/reject]', err.message);
    return res.status(500).json({ success: false, message: 'Gagal menolak pairing.' });
  }
});

module.exports = router;
