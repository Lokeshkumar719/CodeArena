const { Problem } = require('../../models/problem');
const User = require('../../models/user');
const Submission = require('../../models/submission');
const SolutionVideo = require('../../models/solutionVideo');
const ReusableProblemNo = require('../../models/reusableProblemNo');

const asyncHandler = require('../../utils/asyncHandler');
const STATUS_CODES = require('../../constants/statusCodes');
const ApiError = require('../../utils/ApiError');
const validateObjectId = require('../../utils/validation/validateObjectId');
const getNextProblemNo = require('../../utils/problem/getNextProblemNo');
const slugify = require('../../utils/problem/slugify');

const uploadHiddenTestcasesZip = require('../../services/storage/uploadHiddenTestcasesZip');
const validateReferenceSolutions = require('../../services/problem/validateReferenceSolutions');
const attachVideoDetails = require('../../services/problem/attachVideoDetails');
const { listProblems } = require('../../services/problem/listProblems');
const extractHiddenTestcasesFromZip = require('../../services/storage/extractHiddenTestcasesFromZip');
const deleteHiddenTestcasesZip = require('../../services/storage/deleteHiddenTestcasesZip');

const { MAX_REFERENCE_VALIDATION_TESTCASES } = require('../../constants/judge0');

const createProblem = asyncHandler(async (req, res) => {
  let tags;
  let visibleTestCases;
  let startCode;
  let referenceSolution;

  try {
    tags = JSON.parse(req.body.tags);
    visibleTestCases = JSON.parse(req.body.visibleTestCases);
    startCode = JSON.parse(req.body.startCode);
    referenceSolution = JSON.parse(req.body.referenceSolution);
  } catch {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, 'Invalid request payload');
  }

  if (!Array.isArray(referenceSolution)) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, 'Reference solution is required');
  }

  if (!Array.isArray(visibleTestCases)) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, 'Visible testcases are required');
  }

  if (!req.file) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, 'Hidden testcases ZIP is required');
  }

  const hiddenTestCases = extractHiddenTestcasesFromZip(req.file.buffer);

  const allTestCases = [...visibleTestCases, ...hiddenTestCases];

  const validationTestCases = allTestCases.slice(0, MAX_REFERENCE_VALIDATION_TESTCASES);

  await validateReferenceSolutions(referenceSolution, validationTestCases);

  const title = req.body.title.trim();

  const existingProblem = await Problem.findOne({
    title,
  });

  if (existingProblem) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, 'Problem title already exists');
  }

  const problemNo = await getNextProblemNo();

  const slug = slugify(title);

  const hiddenTestCasesZip = await uploadHiddenTestcasesZip(req.file.buffer, problemNo);

  if (!hiddenTestCasesZip?.key) {
    throw new ApiError(STATUS_CODES.INTERNAL_SERVER_ERROR, 'Failed to upload hidden testcases');
  }

  await Problem.create({
    title,
    slug,
    description: req.body.description,
    inputFormat: req.body.inputFormat,
    outputFormat: req.body.outputFormat,
    constraints: req.body.constraints,

    difficulty: req.body.difficulty,
    timeLimit: Number(req.body.timeLimit),
    memoryLimit: Number(req.body.memoryLimit),

    tags,
    visibleTestCases,
    startCode,
    referenceSolution,

    problemNo,
    hiddenTestCasesZip,
    problemCreator: req.user._id,
  });

  return res.status(STATUS_CODES.CREATED).json({
    success: true,
    message: 'Problem created successfully',
  });
});

const updateProblem = asyncHandler(async (req, res) => {
  const { id } = req.params;

  validateObjectId(id);

  let tags;
  let visibleTestCases;
  let startCode;
  let referenceSolution;

  try {
    tags = JSON.parse(req.body.tags);
    visibleTestCases = JSON.parse(req.body.visibleTestCases);
    startCode = JSON.parse(req.body.startCode);
    referenceSolution = JSON.parse(req.body.referenceSolution);
  } catch {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, 'Invalid request payload');
  }

  if (!Array.isArray(referenceSolution)) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, 'Reference solution is required');
  }

  if (!Array.isArray(visibleTestCases)) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, 'Visible testcases are required');
  }

  const dsaProblem = await Problem.findById(id);

  if (!dsaProblem) {
    throw new ApiError(STATUS_CODES.NOT_FOUND, 'Problem not found');
  }

  const title = req.body.title.trim();

  if (title !== dsaProblem.title) {
    const existingProblem = await Problem.findOne({
      title: req.body.title.trim(),
    });

    if (existingProblem) {
      throw new ApiError(STATUS_CODES.BAD_REQUEST, 'Problem title already exists');
    }
  }

  const slug = slugify(title);

  let hiddenTestCasesZip = dsaProblem.hiddenTestCasesZip;

  if (req.file) {
    const hiddenTestCases = extractHiddenTestcasesFromZip(req.file.buffer);

    const allTestCases = [...visibleTestCases, ...hiddenTestCases];

    const validationTestCases = allTestCases.slice(0, MAX_REFERENCE_VALIDATION_TESTCASES);

    await validateReferenceSolutions(referenceSolution, validationTestCases);

    hiddenTestCasesZip = await uploadHiddenTestcasesZip(req.file.buffer, dsaProblem.problemNo);
  }

  const newProblem = await Problem.findByIdAndUpdate(
    id,
    {
      title,
      slug,
      description: req.body.description,
      inputFormat: req.body.inputFormat,
      outputFormat: req.body.outputFormat,
      constraints: req.body.constraints,

      difficulty: req.body.difficulty,
      timeLimit: Number(req.body.timeLimit),
      memoryLimit: Number(req.body.memoryLimit),

      tags,
      visibleTestCases,
      startCode,
      referenceSolution,

      hiddenTestCasesZip,
    },
    {
      runValidators: true,
      returnDocument: 'after',
    }
  );

  return res.status(STATUS_CODES.OK).json({
    success: true,
    message: 'Problem updated successfully',
    data: newProblem,
  });
});

const deleteProblem = asyncHandler(async (req, res) => {
  const { id } = req.params;

  validateObjectId(id);

  const problemToDelete = await Problem.findById(id);

  if (!problemToDelete) {
    throw new ApiError(STATUS_CODES.NOT_FOUND, 'Problem not found');
  }

  // delete related submissions
  await Submission.deleteMany({
    problemId: id,
  });

  // delete related solution videos
  await SolutionVideo.deleteMany({
    problemId: id,
  });

  // remove problem from solved list
  await User.updateMany(
    {},
    {
      $pull: {
        problemSolved: id,
      },
    }
  );

  // Save released number
  await ReusableProblemNo.create({
    value: problemToDelete.problemNo,
  });

  // delete hidden testcase ZIP from R2

  await deleteHiddenTestcasesZip(problemToDelete.hiddenTestCasesZip);

  // delete actual problem
  await Problem.findByIdAndDelete(id);

  return res.status(STATUS_CODES.OK).json({
    success: true,
    message: 'Problem deleted successfully',
  });
});

const getProblemByIdAdmin = asyncHandler(async (req, res) => {
  const { id } = req.params;

  validateObjectId(id);

  const reqdProblem = await Problem.findById(id).select(
    '_id problemNo title description inputFormat outputFormat constraints timeLimit memoryLimit difficulty tags visibleTestCases hiddenTestCasesZip startCode referenceSolution'
  );

  if (!reqdProblem) {
    throw new ApiError(STATUS_CODES.NOT_FOUND, 'Problem not found');
  }

  const responseData = await attachVideoDetails(reqdProblem, id);

  return res.status(STATUS_CODES.OK).json({
    success: true,
    data: responseData,
  });
});

const getProblemBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  const reqdProblem = await Problem.findOne({ slug }).select(
    '_id problemNo title slug description inputFormat outputFormat constraints timeLimit memoryLimit difficulty tags visibleTestCases startCode referenceSolution'
  );

  if (!reqdProblem) {
    throw new ApiError(STATUS_CODES.NOT_FOUND, 'Problem not found');
  }

  const responseData = await attachVideoDetails(reqdProblem, reqdProblem._id);

  return res.status(STATUS_CODES.OK).json({
    success: true,
    data: responseData,
  });
});

const getProblems = asyncHandler(async (req, res) => {
  const userId = req.user?._id ?? null;

  const result = await listProblems(req.query, userId);

  if (!result.success) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, result.errors?.[0] || 'Failed to fetch problems');
  }

  return res.status(STATUS_CODES.OK).json({
    success: true,
    ...result.data,
  });
});

const solvedProblems = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const user = await User.findById(userId).populate({
    path: 'problemSolved',
    select: '_id title difficulty tags',
  });
  return res.status(STATUS_CODES.OK).json({
    success: true,
    data: user.problemSolved,
  });
});

const submittedProblem = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const problemId = req.params.id;
  validateObjectId(problemId);
  const ans = await Submission.find({
    userId,
    problemId,
  }).sort({ createdAt: -1 });
  return res.status(STATUS_CODES.OK).json({
    success: true,
    data: ans,
  });
});

module.exports = {
  createProblem,
  updateProblem,
  deleteProblem,
  getProblemBySlug,
  getProblems,
  solvedProblems,
  submittedProblem,
  getProblemByIdAdmin,
};
