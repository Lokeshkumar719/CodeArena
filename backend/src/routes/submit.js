const express=require('express');
const userMiddleware=require('../middlewares/userMiddleware');
const submitRouter=express.Router();
const {submitCode,runCode}=require('../controllers/userSubmission');
const {limitRunCode,limitSubmitCode}=require("../middlewares/rateLimitMiddleware");

submitRouter.post('/submit/:id',userMiddleware,limitSubmitCode,submitCode);
submitRouter.post('/run/:id',userMiddleware,limitRunCode,runCode);

module.exports=submitRouter;