const supabase = require('../config/supabase');
const { dashboardConnections, sendToDevice } = require('./connectionStore');

function broadcastToDashboards(payload) {
  const message = JSON.stringify(payload);
  for (const dashSocket of dashboardConnections) {
    if (dashSocket.readyState === dashSocket.OPEN) {
      dashSocket.send(message);
    }
  }
}

function pushPlaylistToDevice(deviceId, items) {
  return sendToDevice(deviceId, {
    type: 'push_playlist',
    items: (items || []).map((it) => ({
      id: it.id,
      durasi_detik: it.durasi_detik,
      content: it.contents,
    })),
  });
}

async function pushPlaylistIfActive(deviceId) {
  const { data: device } = await supabase.from('devices').select('mode').eq('id', deviceId).maybeSingle();
  if (!device || device.mode !== 'playlist') return;

  const { data: items } = await supabase
    .from('playlist_items')
    .select('*, contents:content_id(*)')
    .eq('device_id', deviceId)
    .order('urutan', { ascending: true });

  pushPlaylistToDevice(deviceId, items || []);
}

async function setDeviceStatus(deviceId, status) {
  const { data, error } = await supabase
    .from('devices')
    .update({ status, last_seen: new Date().toISOString() })
    .eq('id', deviceId)
    .select()
    .single();

  if (error) {
    console.error('[WS] Gagal update status device:', error.message);
    return null;
  }
  return data;
}

module.exports = {
  broadcastToDashboards,
  pushPlaylistToDevice,
  pushPlaylistIfActive,
  setDeviceStatus,
};
