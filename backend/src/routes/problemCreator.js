const express = require("express");
const problemRouter = express.Router();
const adminMiddleware = require("../middlewares/adminMiddleware");
const {
  createProblem,
  updateProblem,
  deleteProblem,
  getProblemById,
  getProblems,
  solvedProblems,
  submittedProblem,
  getProblemByIdAdmin
} = require("../controllers/problemsControllers");
const userMiddleware = require("../middlewares/userMiddleware");
const {limitSubmitCode}=require("../middlewares/rateLimitMiddleware");
// create fetch update delete problem routes here and export the router

problemRouter.post("/create",userMiddleware,adminMiddleware,limitSubmitCode, createProblem);
problemRouter.put("/update/:id",userMiddleware,adminMiddleware,limitSubmitCode, updateProblem);
problemRouter.delete("/delete/:id",userMiddleware,adminMiddleware, deleteProblem);
problemRouter.get("/admin/problemById/:id",userMiddleware,adminMiddleware,getProblemByIdAdmin);

// fetch problem by id,fetch all problems routes and also fetch all problems solved by a user route here and export the router

problemRouter.get("/problemById/:id", userMiddleware, getProblemById);
problemRouter.get("/getProblems", userMiddleware, getProblems);
problemRouter.get("/problemSolvedByUser", userMiddleware, solvedProblems);
problemRouter.get("/problemSubmmision/:id", userMiddleware, submittedProblem);

module.exports = problemRouter;