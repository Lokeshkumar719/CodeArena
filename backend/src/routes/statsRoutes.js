const express = require('express');

const statsController = require('../controllers/statsController');

const statsRouter = express.Router();

statsRouter.get('/', statsController.getPlatformStats);

module.exports = statsRouter;
