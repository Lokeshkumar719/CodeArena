const express = require("express");
const adminMiddleware = require("../../middlewares/auth/adminMiddleware");
const authMiddleware=require("../../middlewares/auth/authMiddleware");
const videoRouter =  express.Router();
const {generateUploadSignature,saveVideoMetadata,deleteVideo} = require("../../controllers/video/videoController");

videoRouter.get("/create/:problemId",authMiddleware,adminMiddleware,generateUploadSignature);
videoRouter.post("/save",authMiddleware,adminMiddleware,saveVideoMetadata);
videoRouter.delete("/delete/:problemId",authMiddleware,adminMiddleware,deleteVideo);

module.exports = videoRouter;