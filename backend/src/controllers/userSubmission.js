const Problem = require("../models/problems");
const Submission = require("../models/submission");
const { getLanguageById } = require("../utils/problemUtility");
const { submitBatch, submitToken } = require("../services/judge0Service");
const asyncHandler = require("../utils/asyncHandler");
const { JUDGE0_STATUS } = require("../constants/judgeStatus");

const submitCode = asyncHandler(async (req, res) => {
  // as middleware added the user(it's id and all info) so we can extract that to use here
  const userId = req.result._id;
  const problemId = req.params.id;
  const { code, language } = req.body;
  if (!userId || !problemId || !code || !language) {
    return res.status(400).json({
      success: false,
      message: "Some fields are missing",
    });
  }
  const languageId = getLanguageById(language);
  if (!languageId) {
    return res.status(400).json({
      success: false,
      message: "Unsupported language",
    });
  }
  const problem = await Problem.findById(problemId);
  if (!problem) {
    return res.status(404).json({
      success: false,
      message: "Problem not found",
    });
  }
  // Combine both visible and hidden test cases for submission
  const allTestcases = [
    ...problem.visibleTestCases,
    ...problem.hiddenTestCases,
  ];
  const submittedResult = await Submission.create({
    userId,
    problemId,
    code,
    language,
    testCasesPassed: 0,
    status: "pending",
    testCasesTotal: allTestcases.length,
  });
  const submissions = allTestcases.map((testcase) => ({
    source_code: code,
    language_id: languageId,
    stdin: testcase.input,
    expected_output: testcase.output,
  }));
  const submitResult = await submitBatch(submissions);
  const resultToken = submitResult.map((value) => value.token);
  const testResult = await submitToken(resultToken);
  let testCasesPassed = 0;
  let runtime = 0;
  let memory = 0;
  let status = "accepted";
  let errorMessage = null;
  for (const test of testResult) {
    if (test.status.id !== JUDGE0_STATUS.ACCEPTED) {
      status =
        test.status.id === JUDGE0_STATUS.COMPILE_ERROR ? "error" : "wrong";
      errorMessage = test.stderr;
      break;
    }
    testCasesPassed++;
    if (test.time) {
      runtime += parseFloat(test.time);
    }
    memory = Math.max(memory, test.memory || 0);
  }

  submittedResult.status = status;
  submittedResult.testCasesPassed = testCasesPassed;
  submittedResult.runtime = runtime;
  submittedResult.memory = memory;
  submittedResult.errorMessage = errorMessage;
  await submittedResult.save();

  // add the solved problem in user data if not solved earlier only if it is accepted
  if (status === "accepted") {
    await req.result.updateOne({
      // prevent duplicate
      $addToSet: { problemSolved: problemId },
    });
  }

  const accepted = status === "accepted";
  res.status(201).json({
    accepted,
    error: errorMessage,
    totalTestCases: submittedResult.testCasesTotal,
    passedTestCases: testCasesPassed,
    runtime,
    memory,
  });
});


const runCode = asyncHandler(async (req, res) => {
  const userId = req.result._id;
  const problemId = req.params.id;
  const { code, language } = req.body;
  if (!userId || !problemId || !code || !language) {
    return res.status(400).json({
      success: false,
      message: "Some fields are missing",
    });
  }
  const problem = await Problem.findById(problemId);
  if (!problem) {
    return res.status(404).json({
      success: false,
      message: "Problem not found",
    });
  }
  const languageId = getLanguageById(language);
  if (!languageId) {
    return res.status(400).json({
      success: false,
      message: "Unsupported language",
    });
  }
  // Only visible test cases for run
  const submissions = problem.visibleTestCases.map((testcase) => ({
    source_code: code,
    language_id: languageId,
    stdin: testcase.input,
    expected_output: testcase.output,
  }));
  const submitResult = await submitBatch(submissions);
  const resultTokens = submitResult.map((value) => value.token);
  const testResult = await submitToken(resultTokens);
  let testCasesPassed = 0;
  let runtime = 0;
  let memory = 0;
  let status = "accepted";
  let errorMessage = null;
  for (const test of testResult) {
    if (test.status.id !== JUDGE0_STATUS.ACCEPTED) {
      status =
        test.status.id === JUDGE0_STATUS.COMPILE_ERROR ? "error" : "wrong";
      errorMessage = test.stderr;
      break;
    }
    testCasesPassed++;
    if (test.time) {
      runtime += parseFloat(test.time);
    }
    memory = Math.max(memory, test.memory || 0);
  }
  res.status(201).json({
    success: status === "accepted",
    testCases: testResult,
    runtime,
    memory,
    error: errorMessage,
    passedTestCases: testCasesPassed,
  });
});

module.exports = { submitCode, runCode };
