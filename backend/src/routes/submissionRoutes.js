const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const rateLimitMiddleware = require('../middlewares/rateLimitMiddleware');

const submissionController = require('../controllers/submissionController');
const validateSubmissionInput = require('../validators/validateSubmissionInput');

const submitRouter = express.Router();

submitRouter.post(
  '/submit/:id',
  authMiddleware,
  rateLimitMiddleware.limitSubmitCode,
  validateSubmissionInput,
  submissionController.submitCode
);
submitRouter.post(
  '/run/:id',
  authMiddleware,
  rateLimitMiddleware.limitRunCode,
  validateSubmissionInput,
  submissionController.runCode
);

module.exports = submitRouter;
