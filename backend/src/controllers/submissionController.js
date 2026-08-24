const asyncHandler = require('../utils/asyncHandler');
const STATUS_CODES = require('../constants/statusCodes');
const submissionService = require('../services/submission/submissionService');

const submitCode = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const problemId = req.params.id;
  const { code, language } = req.body;

  const result = await submissionService.submitCodeService(userId, problemId, code, language);

  return res.status(STATUS_CODES.CREATED).json({
    success: true,
    data: result,
  });
});

const runCode = asyncHandler(async (req, res) => {
  const problemId = req.params.id;
  const { code, language } = req.body;

  const result = await submissionService.runCodeService(problemId, code, language);

  return res.status(STATUS_CODES.OK).json({
    success: true,
    data: result,
  });
});

module.exports = {
  submitCode,
  runCode,
};
