const express = require('express');
const authMiddleware = require('../../middlewares/auth/authMiddleware');

const { submitCode, runCode } = require('../../controllers/submission/submissionController');
const { limitRunCode, limitSubmitCode } = require('../../middlewares/rateLimitMiddleware');

const submitRouter = express.Router();

submitRouter.post('/submit/:id', authMiddleware, limitSubmitCode, submitCode);
submitRouter.post('/run/:id', authMiddleware, limitRunCode, runCode);

module.exports = submitRouter;
