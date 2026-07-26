const url = require('url');
const jwt = require('jsonwebtoken');
const { WebSocketServer } = require('ws');
const { JWT_SECRET } = require('../config/env');
const supabase = require('../config/supabase');
const {
  deviceConnections,
  addDeviceConnection,
  removeDeviceConnection,
  dashboardConnections,
} = require('./connectionStore');
const { broadcastToDashboards, pushPlaylistToDevice, setDeviceStatus } = require('./broadcast');

const wss = new WebSocketServer({ noServer: true });

function rejectUpgrade(socket, statusLine) {
  socket.write(`HTTP/1.1 ${statusLine}\r\n\r\n`);
  socket.destroy();
}

function attachUpgradeHandler(server) {
  server.on('upgrade', async (request, socket, head) => {
    const { pathname, query } = url.parse(request.url, true);

    if (pathname !== '/ws') {
      socket.destroy();
      return;
    }

    const { deviceId, role, token } = query;

    try {
      if (role === 'dashboard') {
        if (!token) {
          rejectUpgrade(socket, '401 Unauthorized');
          return;
        }
        jwt.verify(token, JWT_SECRET);
      } else {
        if (!deviceId || !token) {
          rejectUpgrade(socket, '401 Unauthorized');
          return;
        }

        const { data: device, error } = await supabase
          .from('devices')
          .select('id, ws_token')
          .eq('id', deviceId)
          .maybeSingle();

        if (error || !device || String(device.ws_token) !== String(token)) {
          rejectUpgrade(socket, '401 Unauthorized');
          return;
        }
      }
    } catch (err) {
      rejectUpgrade(socket, '401 Unauthorized');
      return;
    }

    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit('connection', ws, request, query);
    });
  });
}

wss.on('connection', async (ws, request, query) => {
  const { deviceId, role } = query;

  if (role === 'dashboard') {
    dashboardConnections.add(ws);
    ws.on('close', () => dashboardConnections.delete(ws));
    ws.send(JSON.stringify({ type: 'connected', message: 'Dashboard tersambung ke realtime engine' }));
    return;
  }

  if (!deviceId) {
    ws.close(1008, 'deviceId wajib disertakan di query string');
    return;
  }

  const { wasOnline } = addDeviceConnection(deviceId, ws);

  if (!wasOnline) {
    const updatedDevice = await setDeviceStatus(deviceId, 'online');
    broadcastToDashboards({
      type: 'device_status',
      deviceId,
      status: 'online',
      device: updatedDevice,
    });
  }

  console.log(`[WS] Device connected: ${deviceId} (total koneksi: ${deviceConnections.get(deviceId)?.size || 0})`);

  try {
    const { data: deviceRow } = await supabase
      .from('devices')
      .select('*, contents:current_content_id(*)')
      .eq('id', deviceId)
      .single();

    if (deviceRow && deviceRow.mode === 'playlist') {
      const { data: items } = await supabase
        .from('playlist_items')
        .select('*, contents:content_id(*)')
        .eq('device_id', deviceId)
        .order('urutan', { ascending: true });

      if (items && items.length > 0) {
        pushPlaylistToDevice(deviceId, items);
      }
    } else if (deviceRow && deviceRow.contents) {
      ws.send(
        JSON.stringify({
          type: 'push_content',
          content: deviceRow.contents,
        })
      );
    }
  } catch (err) {
    console.error('[WS] Gagal ambil konten aktif device:', err.message);
  }

  ws.on('close', async () => {
    const isNowFullyOffline = removeDeviceConnection(deviceId, ws);

    if (isNowFullyOffline) {
      const updated = await setDeviceStatus(deviceId, 'offline');
      broadcastToDashboards({
        type: 'device_status',
        deviceId,
        status: 'offline',
        device: updated,
      });
      console.log(`[WS] Device disconnected (fully offline): ${deviceId}`);
    } else {
      console.log(`[WS] Salah satu koneksi device ditutup, tapi masih ada koneksi lain aktif: ${deviceId} (sisa: ${deviceConnections.get(deviceId)?.size || 0})`);
    }
  });

  ws.on('error', (err) => {
    console.error(`[WS] Error pada device ${deviceId}:`, err.message);
  });
});

module.exports = { wss, attachUpgradeHandler };
