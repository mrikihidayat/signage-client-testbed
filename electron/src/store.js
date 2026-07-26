const fs = require('fs');
const path = require('path');
const { app } = require('electron');
const { CONFIG_FILE_NAME } = require('./config');

function getConfigPath() {
  return path.join(app.getPath('userData'), CONFIG_FILE_NAME);
}

function readDeviceConfig() {
  try {
    const raw = fs.readFileSync(getConfigPath(), 'utf-8');
    const parsed = JSON.parse(raw);
    if (parsed && parsed.deviceId && parsed.token) return parsed;
    return null;
  } catch (err) {
    return null;
  }
}

function writeDeviceConfig(config) {
  fs.mkdirSync(path.dirname(getConfigPath()), { recursive: true });
  fs.writeFileSync(getConfigPath(), JSON.stringify(config, null, 2), 'utf-8');
}

function clearDeviceConfig() {
  try {
    fs.unlinkSync(getConfigPath());
  } catch (err) {
    return;
  }
}

module.exports = { readDeviceConfig, writeDeviceConfig, clearDeviceConfig };
