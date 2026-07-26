const path = require('path');
const { BrowserWindow } = require('electron');
const { requestPairingCode, checkPairingStatus } = require('./api');
const { ICON_PATH, POLL_INTERVAL_MS, isKioskMode } = require('./config');

function createPairingWindow() {
  const kiosk = isKioskMode();

  return new BrowserWindow({
    fullscreen: kiosk,
    kiosk,
    autoHideMenuBar: kiosk,
    width: kiosk ? undefined : 900,
    height: kiosk ? undefined : 600,
    backgroundColor: '#0f172a',
    icon: ICON_PATH,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
    },
  });
}

function setCode(win, code) {
  if (!win || win.isDestroyed()) return;
  win.webContents.executeJavaScript(
    `window.__setPairingCode && window.__setPairingCode(${JSON.stringify(code)})`
  );
}

function setError(win, message) {
  if (!win || win.isDestroyed()) return;
  win.webContents.executeJavaScript(
    `window.__setPairingError && window.__setPairingError(${JSON.stringify(message)})`
  );
}

function waitForApproval(pairId) {
  return new Promise((resolve, reject) => {
    const timer = setInterval(async () => {
      try {
        const result = await checkPairingStatus(pairId);

        if (result.status === 'approved') {
          clearInterval(timer);
          resolve({ deviceId: result.deviceId, token: result.wsToken });
        }

        if (result.status === 'expired') {
          clearInterval(timer);
          reject(new Error('Kode pairing kedaluwarsa, silakan restart aplikasi'));
        }
      } catch (err) {
        clearInterval(timer);
        reject(err);
      }
    }, POLL_INTERVAL_MS);
  });
}

async function runPairingFlow() {
  const win = createPairingWindow();
  win.loadFile(path.join(__dirname, '..', 'pairing.html'));

  await new Promise((resolve) => win.webContents.once('did-finish-load', resolve));

  try {
    const { pairId, code } = await requestPairingCode();
    setCode(win, code);

    const result = await waitForApproval(pairId);
    win.close();
    return result;
  } catch (err) {
    setError(win, err.message);
    throw err;
  }
}

module.exports = { runPairingFlow };
