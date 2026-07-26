const { app, globalShortcut, BrowserWindow, nativeImage } = require('electron');
const { getEnvDeviceOverride, ICON_PATH } = require('./src/config');
const { readDeviceConfig, writeDeviceConfig, clearDeviceConfig } = require('./src/store');
const { runPairingFlow } = require('./src/pairingWindow');
const { createDisplayWindow } = require('./src/displayWindow');

let activeWindow = null;

async function resolveDeviceConfig() {
  const envOverride = getEnvDeviceOverride();
  if (envOverride) return envOverride;

  const stored = readDeviceConfig();
  if (stored) return stored;

  const paired = await runPairingFlow();
  writeDeviceConfig(paired);
  return paired;
}

async function start() {
  const deviceConfig = await resolveDeviceConfig();

  activeWindow = createDisplayWindow(deviceConfig.deviceId, deviceConfig.token);
  activeWindow.on('closed', () => {
    activeWindow = null;
  });
}

function registerAutoLaunch() {
  if (!app.isPackaged) return;
  app.setLoginItemSettings({ openAtLogin: true, openAsHidden: false });
}

app.whenReady().then(() => {
  if (process.platform === 'darwin') {
    const dockIcon = nativeImage.createFromPath(ICON_PATH);
    if (!dockIcon.isEmpty()) app.dock.setIcon(dockIcon);
  }

  registerAutoLaunch();
  start();

  globalShortcut.register('Control+Shift+Q', () => {
    app.quit();
  });

  globalShortcut.register('Control+Shift+R', () => {
    if (activeWindow) activeWindow.reload();
  });

  globalShortcut.register('Control+Shift+U', () => {
    clearDeviceConfig();
    if (activeWindow) activeWindow.close();
    start();
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) start();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});
