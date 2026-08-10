const express = require('express');
const problemRouter = express.Router();

const adminMiddleware = require('../../middlewares/auth/adminMiddleware');
const authMiddleware = require('../../middlewares/auth/authMiddleware');
const { limitSubmitCode } = require('../../middlewares/rateLimitMiddleware');
const upload = require('../../middlewares/uploadZipMiddleware');

const {
  createProblem,
  updateProblem,
  deleteProblem,
  getProblemBySlug,
  getProblems,
  solvedProblems,
  submittedProblem,
  getProblemByIdAdmin,
} = require('../../controllers/problem/problemController');

problemRouter.post(
  '/create',
  authMiddleware,
  adminMiddleware,
  limitSubmitCode,
  upload.single('hiddenTestCasesZip'),
  createProblem
);

problemRouter.patch(
  '/update/:id',
  authMiddleware,
  adminMiddleware,
  limitSubmitCode,
  upload.single('hiddenTestCasesZip'),
  updateProblem
);

problemRouter.delete('/delete/:id', authMiddleware, adminMiddleware, deleteProblem);

problemRouter.get('/admin/problemById/:id', authMiddleware, adminMiddleware, getProblemByIdAdmin);

problemRouter.get('/getProblems', authMiddleware, getProblems);
problemRouter.get('/problemSolvedByUser', authMiddleware, solvedProblems);
problemRouter.get('/problemSubmmision/:id', authMiddleware, submittedProblem);
problemRouter.get('/:slug', authMiddleware, getProblemBySlug);

module.exports = problemRouter;
