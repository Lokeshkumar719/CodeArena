const express = require('express');
const problemRouter = express.Router();
const adminMiddleware = require('../../middlewares/auth/adminMiddleware');
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
const authMiddleware = require('../../middlewares/auth/authMiddleware');
const { limitSubmitCode } = require('../../middlewares/rateLimitMiddleware');
// create fetch update delete problem routes here and export the router

problemRouter.post('/create', authMiddleware, adminMiddleware, limitSubmitCode, createProblem);
problemRouter.put('/update/:id', authMiddleware, adminMiddleware, limitSubmitCode, updateProblem);
problemRouter.delete('/delete/:id', authMiddleware, adminMiddleware, deleteProblem);
problemRouter.get('/admin/problemById/:id', authMiddleware, adminMiddleware, getProblemByIdAdmin);

// fetch problem by id,fetch all problems routes and also fetch all problems solved by a user route here and export the router

problemRouter.get('/problemById/:id', authMiddleware, getProblemById);
problemRouter.get('/getProblems', authMiddleware, getProblems);
problemRouter.get('/problemSolvedByUser', authMiddleware, solvedProblems);
problemRouter.get('/problemSubmmision/:id', authMiddleware, submittedProblem);

module.exports = problemRouter;
