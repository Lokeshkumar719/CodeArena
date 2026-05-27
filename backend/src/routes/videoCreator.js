const express = require("express");
const adminMiddleware = require("../middlewares/adminMiddleware");
const userMiddleware=require("../middlewares/userMiddleware");
const videoRouter =  express.Router();
const {generateUploadSignature,saveVideoMetadata,deleteVideo} = require("../controllers/videoSection");

videoRouter.get("/create/:problemId",userMiddleware,adminMiddleware,generateUploadSignature);
videoRouter.post("/save",userMiddleware,adminMiddleware,saveVideoMetadata);
videoRouter.delete("/delete/:problemId",userMiddleware,adminMiddleware,deleteVideo);

module.exports = videoRouter;