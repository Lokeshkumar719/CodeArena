const Submission = require('../models/submission');
const mongoose = require('mongoose');

const countSubmissions = async (filter) => {
  return await Submission.countDocuments(filter);
};

const createSubmission = async (submissionData) => {
  return await Submission.create(submissionData);
};

const saveSubmission = async (submission) => {
  return await submission.save();
};

const findSubmissions = async (filter) => {
  return await Submission.find(filter);
};

const findAcceptedProblemIdsForUser = async (userId) => {
  const accepted = await Submission.find(
    { userId, status: 'accepted' },
    { problemId: 1, _id: 0 }
  ).lean();

  const uniqueIds = [...new Set(accepted.map((s) => s.problemId.toString()))];

  return uniqueIds.map((id) => new mongoose.Types.ObjectId(id));
};

module.exports = {
  countSubmissions,
  findAcceptedProblemIdsForUser,
  createSubmission,
  saveSubmission,
  findSubmissions,
};
