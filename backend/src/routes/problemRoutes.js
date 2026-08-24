const express = require('express');
const problemRouter = express.Router();

const adminMiddleware = require('../middlewares/adminMiddleware');
const authMiddleware = require('../middlewares/authMiddleware');
const rateLimitMiddleware = require('../middlewares/rateLimitMiddleware');
const upload = require('../middlewares/uploadZipMiddleware');

const problemController = require('../controllers/problemController');

const validateObjectIdParams = require('../validators/validateObjectId');

problemRouter.post(
  '/create',
  authMiddleware,
  adminMiddleware,
  rateLimitMiddleware.limitSubmitCode,
  upload.single('hiddenTestCasesZip'),
  problemController.createProblem
);

problemRouter.patch(
  '/update/:id',
  authMiddleware,
  adminMiddleware,
  rateLimitMiddleware.limitSubmitCode,
  upload.single('hiddenTestCasesZip'),
  validateObjectIdParams('id'),
  problemController.updateProblem
);

problemRouter.delete(
  '/delete/:id',
  authMiddleware,
  adminMiddleware,
  validateObjectIdParams('id'),
  problemController.deleteProblem
);

problemRouter.get(
  '/admin/problemById/:id',
  authMiddleware,
  adminMiddleware,
  validateObjectIdParams('id'),
  problemController.getProblemByIdAdmin
);

problemRouter.get('/getProblems', authMiddleware, problemController.getProblems);
problemRouter.get('/problemSolvedByUser', authMiddleware, problemController.solvedProblems);
problemRouter.get(
  '/problemSubmmision/:id',
  authMiddleware,
  validateObjectIdParams('id'),
  problemController.submittedProblem
);
problemRouter.get('/:slug', authMiddleware, problemController.getProblemBySlug);

module.exports = problemRouter;
