const express = require('express');
const { countDeviceConnections, dashboardConnections } = require('../realtime/connectionStore');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Signage Control Panel API is running.',
    connectedDevices: countDeviceConnections(),
    connectedDashboards: dashboardConnections.size,
  });
});

module.exports = router;
