const deviceConnections = new Map();
const dashboardConnections = new Set();

function addDeviceConnection(deviceId, ws) {
  let sockets = deviceConnections.get(deviceId);
  if (!sockets) {
    sockets = new Set();
    deviceConnections.set(deviceId, sockets);
  }
  const wasOnline = sockets.size > 0;
  sockets.add(ws);
  return { wasOnline };
}

function removeDeviceConnection(deviceId, ws) {
  const sockets = deviceConnections.get(deviceId);
  if (!sockets) return true;
  sockets.delete(ws);
  if (sockets.size === 0) {
    deviceConnections.delete(deviceId);
    return true;
  }
  return false;
}

function isDeviceOnline(deviceId) {
  const sockets = deviceConnections.get(deviceId);
  return !!sockets && sockets.size > 0;
}

function sendToDevice(deviceId, payload) {
  const sockets = deviceConnections.get(deviceId);
  if (!sockets || sockets.size === 0) return false;
  const message = JSON.stringify(payload);
  let sentToAny = false;
  for (const socket of sockets) {
    if (socket.readyState === socket.OPEN) {
      socket.send(message);
      sentToAny = true;
    }
  }
  return sentToAny;
}

function closeDeviceConnections(deviceId, code, reason) {
  const sockets = deviceConnections.get(deviceId);
  if (!sockets) return;
  for (const socket of sockets) {
    socket.close(code, reason);
  }
}

function countDeviceConnections() {
  let total = 0;
  for (const sockets of deviceConnections.values()) total += sockets.size;
  return total;
}

module.exports = {
  deviceConnections,
  dashboardConnections,
  addDeviceConnection,
  removeDeviceConnection,
  isDeviceOnline,
  sendToDevice,
  closeDeviceConnections,
  countDeviceConnections,
};
