const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');
const authenticateMiddleware = require('../middleware/authenticateMiddleware');

//router.use(authenticateMiddleware);

// 5. GET /api/inventory/devices/sysdate
router.get('/devices/sysdate', inventoryController.getSysdateDevices);

// 6. GET /api/inventory/devices/all
router.get('/devices/all', inventoryController.getAllDevices);

//7.  GET /api/inventory/devices/dto/:deviceNumber/slno
router.get('/devices/dto/:deviceNumber/slno', inventoryController.getDeviceDTOByNumber);

// GET /api/inventory/devices/:deviceNumber/slno
router.get('/devices/:deviceNumber/slno', inventoryController.getDeviceByNumber);

// GET /api/inventory/devices/status/:deviceId/slno
router.get('/devices/status/:deviceId/slno', inventoryController.getDeviceStatusById);

module.exports = router;