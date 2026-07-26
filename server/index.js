const http = require('http');
const { PORT } = require('./src/config/env');
const createApp = require('./src/app');
const { attachUpgradeHandler } = require('./src/realtime/wsServer');

const app = createApp();
const server = http.createServer(app);

attachUpgradeHandler(server);

server.listen(PORT, () => {
  console.log(`============================================================`);
  console.log(` Signage Control Panel Server - MJ Solution Indonesia`);
  console.log(` REST API   : http://localhost:${PORT}/api`);
  console.log(` API Docs   : http://localhost:${PORT}/api-docs`);
  console.log(` WebSocket  : ws://localhost:${PORT}/ws`);
  console.log(`============================================================`);
});
