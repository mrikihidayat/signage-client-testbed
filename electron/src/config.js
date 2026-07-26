const path = require('path');

const APP_BASE_URL = process.env.APP_BASE_URL || 'http://localhost:5173';
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:5000';
const CONFIG_FILE_NAME = 'device-pairing.json';
const POLL_INTERVAL_MS = 3000;
const ICON_PATH = path.join(__dirname, '..', 'assets', 'icon.ico');

function getEnvDeviceOverride() {
  if (process.env.DEVICE_ID && process.env.DEVICE_TOKEN) {
    return { deviceId: process.env.DEVICE_ID, token: process.env.DEVICE_TOKEN };
  }
  return null;
}

function isKioskMode() {
  return process.env.KIOSK_MODE !== 'false';
}

module.exports = {
  APP_BASE_URL,
  API_BASE_URL,
  CONFIG_FILE_NAME,
  POLL_INTERVAL_MS,
  ICON_PATH,
  getEnvDeviceOverride,
  isKioskMode,
};
