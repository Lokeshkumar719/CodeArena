const express = require('express');

const { getPlatformStats } = require('../controllers/statsController');

const statsRouter = express.Router();

statsRouter.get('/', getPlatformStats);

module.exports = statsRouter;
