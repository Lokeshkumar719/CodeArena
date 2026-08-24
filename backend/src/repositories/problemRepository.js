const { Problem } = require('../models/problem');

const countProblems = async (filter) => {
  return await Problem.countDocuments(filter);
};

const findProblems = async (filter, projection, sort, skip, limit) => {
  return await Problem.find(filter, projection).sort(sort).skip(skip).limit(limit).lean();
};

const createProblem = async (problemData) => {
  return await Problem.create(problemData);
};

const findProblemByTitle = async (title) => {
  return await Problem.findOne({ title });
};

const findProblemById = async (id) => {
  return await Problem.findById(id);
};

const updateProblemById = async (id, updateData) => {
  return await Problem.findByIdAndUpdate(id, updateData, {
    runValidators: true,
    returnDocument: 'after',
  });
};

const deleteProblemById = async (id) => {
  return await Problem.findByIdAndDelete(id);
};

const findProblemByIdWithSelectedFields = async (id, fields) => {
  return await Problem.findById(id).select(fields);
};

const findProblemBySlugWithSelectedFields = async (slug, fields) => {
  return await Problem.findOne({ slug }).select(fields);
};

module.exports = {
  countProblems,
  findProblems,
  createProblem,
  findProblemByTitle,
  findProblemById,
  updateProblemById,
  deleteProblemById,
  findProblemByIdWithSelectedFields,
  findProblemBySlugWithSelectedFields,
};
