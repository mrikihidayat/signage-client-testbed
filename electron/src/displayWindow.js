const { BrowserWindow, Menu } = require('electron');
const { APP_BASE_URL, ICON_PATH, isKioskMode } = require('./config');

function createDisplayWindow(deviceId, token) {
  const kiosk = isKioskMode();

  Menu.setApplicationMenu(kiosk ? null : Menu.getApplicationMenu());

  const win = new BrowserWindow({
    fullscreen: kiosk,
    kiosk,
    autoHideMenuBar: kiosk,
    width: kiosk ? undefined : 1280,
    height: kiosk ? undefined : 800,
    backgroundColor: '#000000',
    icon: ICON_PATH,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  const url = `${APP_BASE_URL}/display/${deviceId}?token=${token}`;
  win.loadURL(url);

  if (!kiosk) {
    win.webContents.openDevTools({ mode: 'detach' });
  }

  win.webContents.on('did-fail-load', () => {
    setTimeout(() => {
      if (!win.isDestroyed()) win.loadURL(url);
    }, 3000);
  });

  return win;
}

module.exports = { createDisplayWindow };
