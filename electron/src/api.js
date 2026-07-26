const { API_BASE_URL } = require('./config');

async function requestPairingCode() {
  const res = await fetch(`${API_BASE_URL}/api/pairing/request`, { method: 'POST' });
  if (!res.ok) throw new Error('Gagal meminta kode pairing dari server');
  return res.json();
}

async function checkPairingStatus(pairId) {
  const res = await fetch(`${API_BASE_URL}/api/pairing/${pairId}/status`);
  if (!res.ok) throw new Error('Gagal memeriksa status pairing');
  return res.json();
}

module.exports = { requestPairingCode, checkPairingStatus };
