const { Problem } = require('../../models/problem');
const User = require('../../models/user');
const Submission = require('../../models/submission');
const SolutionVideo = require('../../models/solutionVideo');
const ReusableProblemNo = require('../../models/reusableProblemNo');
const problemRepository = require('../../repositories/problemRepository');

const STATUS_CODES = require('../../constants/statusCodes');
const ApiError = require('../../utils/ApiError');
const getNextProblemNo = require('../../utils/problem/getNextProblemNo');
const slugify = require('../../utils/problem/slugify');

const uploadHiddenTestcasesZip = require('../../services/storage/uploadHiddenTestcasesZip');
const validateReferenceSolutions = require('../../services/problem/validateReferenceSolutions');
const attachVideoDetails = require('../../services/problem/attachVideoDetails');
const { listProblems } = require('../../services/problem/listProblems');
const extractHiddenTestcasesFromZip = require('../../services/storage/extractHiddenTestcasesFromZip');
const deleteHiddenTestcasesZip = require('../../services/storage/deleteHiddenTestcasesZip');

const { MAX_REFERENCE_VALIDATION_TESTCASES } = require('../../constants/judge0');

const createProblemService = async (body, fileBuffer, userId) => {
  let tags;
  let visibleTestCases;
  let startCode;
  let referenceSolution;

  try {
    tags = JSON.parse(body.tags);
    visibleTestCases = JSON.parse(body.visibleTestCases);
    startCode = JSON.parse(body.startCode);
    referenceSolution = JSON.parse(body.referenceSolution);
  } catch {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, 'Invalid request payload');
  }

  if (!Array.isArray(referenceSolution)) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, 'Reference solution is required');
  }

  if (!Array.isArray(visibleTestCases)) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, 'Visible testcases are required');
  }

  if (!fileBuffer) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, 'Hidden testcases ZIP is required');
  }

  const hiddenTestCases = extractHiddenTestcasesFromZip(fileBuffer);
  const allTestCases = [...visibleTestCases, ...hiddenTestCases];
  const validationTestCases = allTestCases.slice(0, MAX_REFERENCE_VALIDATION_TESTCASES);

  await validateReferenceSolutions(referenceSolution, validationTestCases);

  const title = body.title.trim();
  const existingProblem = await problemRepository.findProblemByTitle(title);

  if (existingProblem) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, 'Problem title already exists');
  }

  const problemNo = await getNextProblemNo();
  const slug = slugify(title);

  const hiddenTestCasesZip = await uploadHiddenTestcasesZip(fileBuffer, problemNo);
  if (!hiddenTestCasesZip?.key) {
    throw new ApiError(STATUS_CODES.INTERNAL_SERVER_ERROR, 'Failed to upload hidden testcases');
  }

  const problemData = {
    title,
    slug,
    description: body.description,
    inputFormat: body.inputFormat,
    outputFormat: body.outputFormat,
    constraints: body.constraints,
    difficulty: body.difficulty,
    timeLimit: Number(body.timeLimit),
    memoryLimit: Number(body.memoryLimit),
    tags,
    visibleTestCases,
    startCode,
    referenceSolution,
    problemNo,
    hiddenTestCasesZip,
    problemCreator: userId,
  };

  const problem = await problemRepository.createProblem(problemData);
  return problem;
};

const updateProblemService = async (id, body, fileBuffer) => {
  let tags;
  let visibleTestCases;
  let startCode;
  let referenceSolution;

  try {
    tags = JSON.parse(body.tags);
    visibleTestCases = JSON.parse(body.visibleTestCases);
    startCode = JSON.parse(body.startCode);
    referenceSolution = JSON.parse(body.referenceSolution);
  } catch {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, 'Invalid request payload');
  }

  if (!Array.isArray(referenceSolution)) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, 'Reference solution is required');
  }

  if (!Array.isArray(visibleTestCases)) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, 'Visible testcases are required');
  }

  const dsaProblem = await problemRepository.findProblemById(id);
  if (!dsaProblem) {
    throw new ApiError(STATUS_CODES.NOT_FOUND, 'Problem not found');
  }

  const title = body.title.trim();
  if (title !== dsaProblem.title) {
    const existingProblem = await problemRepository.findProblemByTitle(title);
    if (existingProblem) {
      throw new ApiError(STATUS_CODES.BAD_REQUEST, 'Problem title already exists');
    }
  }

  const slug = slugify(title);
  let hiddenTestCasesZip = dsaProblem.hiddenTestCasesZip;

  if (fileBuffer) {
    const hiddenTestCases = extractHiddenTestcasesFromZip(fileBuffer);
    const allTestCases = [...visibleTestCases, ...hiddenTestCases];
    const validationTestCases = allTestCases.slice(0, MAX_REFERENCE_VALIDATION_TESTCASES);

    await validateReferenceSolutions(referenceSolution, validationTestCases);

    hiddenTestCasesZip = await uploadHiddenTestcasesZip(fileBuffer, dsaProblem.problemNo);
  }

  const updateData = {
    title,
    slug,
    description: body.description,
    inputFormat: body.inputFormat,
    outputFormat: body.outputFormat,
    constraints: body.constraints,
    difficulty: body.difficulty,
    timeLimit: Number(body.timeLimit),
    memoryLimit: Number(body.memoryLimit),
    tags,
    visibleTestCases,
    startCode,
    referenceSolution,
    hiddenTestCasesZip,
  };

  const newProblem = await problemRepository.updateProblemById(id, updateData);
  return newProblem;
};

const deleteProblemService = async (id) => {
  const problemToDelete = await problemRepository.findProblemById(id);

  if (!problemToDelete) {
    throw new ApiError(STATUS_CODES.NOT_FOUND, 'Problem not found');
  }

  await Submission.deleteMany({ problemId: id });
  await SolutionVideo.deleteMany({ problemId: id });

  await User.updateMany({}, { $pull: { problemSolved: id } });

  await ReusableProblemNo.create({
    value: problemToDelete.problemNo,
  });

  await deleteHiddenTestcasesZip(problemToDelete.hiddenTestCasesZip);

  await problemRepository.deleteProblemById(id);
};

const getProblemByIdAdminService = async (id) => {
  const reqdProblem = await problemRepository.findProblemByIdWithSelectedFields(
    id,
    '_id problemNo title description inputFormat outputFormat constraints timeLimit memoryLimit difficulty tags visibleTestCases hiddenTestCasesZip startCode referenceSolution'
  );

  if (!reqdProblem) {
    throw new ApiError(STATUS_CODES.NOT_FOUND, 'Problem not found');
  }

  const responseData = await attachVideoDetails(reqdProblem, id);
  return responseData;
};

const getProblemBySlugService = async (slug) => {
  const reqdProblem = await problemRepository.findProblemBySlugWithSelectedFields(
    slug,
    '_id problemNo title slug description inputFormat outputFormat constraints timeLimit memoryLimit difficulty tags visibleTestCases startCode referenceSolution'
  );

  if (!reqdProblem) {
    throw new ApiError(STATUS_CODES.NOT_FOUND, 'Problem not found');
  }

  const responseData = await attachVideoDetails(reqdProblem, reqdProblem._id);
  return responseData;
};

const getProblemsService = async (query, userId) => {
  const result = await listProblems(query, userId);

  if (!result.success) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, result.errors?.[0] || 'Failed to fetch problems');
  }

  return result.data;
};

const solvedProblemsService = async (userId) => {
  const user = await User.findById(userId).populate({
    path: 'problemSolved',
    select: '_id title difficulty tags',
  });
  return user.problemSolved;
};

const submittedProblemService = async (userId, problemId) => {
  const ans = await Submission.find({
    userId,
    problemId,
  }).sort({ createdAt: -1 });
  return ans;
};

module.exports = {
  createProblemService,
  updateProblemService,
  deleteProblemService,
  getProblemByIdAdminService,
  getProblemBySlugService,
  getProblemsService,
  solvedProblemsService,
  submittedProblemService,
};
