const express = require('express');
const cors = require('cors');
const { CORS_ORIGIN } = require('./config/env');
const setupSwagger = require('./docs/swagger');

const authRoutes = require('./routes/auth.routes');
const devicesRoutes = require('./routes/devices.routes');
const playlistRoutes = require('./routes/playlist.routes');
const contentsRoutes = require('./routes/contents.routes');
const pushContentRoutes = require('./routes/pushContent.routes');
const pairingRoutes = require('./routes/pairing.routes');
const healthRoutes = require('./routes/health.routes');

function createApp() {
  const app = express();

  app.use(cors({ origin: CORS_ORIGIN, credentials: true }));
  app.use(express.json({ limit: '5mb' }));

  setupSwagger(app);

  app.use('/api/auth', authRoutes);
  app.use('/api/devices', devicesRoutes);
  app.use('/api/devices/:deviceId/playlist', playlistRoutes);
  app.use('/api/contents', contentsRoutes);
  app.use('/api/push-content', pushContentRoutes);
  app.use('/api/pairing', pairingRoutes);
  app.use('/api/health', healthRoutes);

  app.use((req, res) => {
    res.status(404).json({ success: false, message: 'Endpoint tidak ditemukan.' });
  });

  return app;
}

module.exports = createApp;
