const express = require('express');
const problemRouter = express.Router();

const adminMiddleware = require('../../middlewares/auth/adminMiddleware');
const authMiddleware = require('../../middlewares/auth/authMiddleware');
const { limitSubmitCode } = require('../../middlewares/rateLimitMiddleware');

const {
  createProblem,
  updateProblem,
  deleteProblem,
  getProblemById,
  getProblems,
  solvedProblems,
  submittedProblem,
  getProblemByIdAdmin,
} = require('../../controllers/problem/problemController');

problemRouter.post('/create', authMiddleware, adminMiddleware, limitSubmitCode, createProblem);
problemRouter.put('/update/:id', authMiddleware, adminMiddleware, limitSubmitCode, updateProblem);
problemRouter.delete('/delete/:id', authMiddleware, adminMiddleware, deleteProblem);
problemRouter.get('/admin/problemById/:id', authMiddleware, adminMiddleware, getProblemByIdAdmin);

problemRouter.get('/problemById/:id', authMiddleware, getProblemById);
problemRouter.get('/getProblems', authMiddleware, getProblems);
problemRouter.get('/problemSolvedByUser', authMiddleware, solvedProblems);
problemRouter.get('/problemSubmmision/:id', authMiddleware, submittedProblem);

module.exports = problemRouter;
