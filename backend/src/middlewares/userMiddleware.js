const jwt = require("jsonwebtoken");
const User = require("../models/user");
const redisClient = require("../config/redis");
const asyncHandler = require("../utils/asyncHandler");

// this middleware checks whether the user is authenticated or not
const userMiddleware = asyncHandler(async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return res.status(401).send("Unauthorized Access");
  }

  // jwt.verify() either returns the decoded payload if token is valid
  // OR throws an error immediately if token is invalid/expired.
  // So no need to check if payload exists separately.

  const payload = jwt.verify(token, process.env.JWT_KEY);

  const { id } = payload;

  if (!id) {
    return res.status(401).send("Invalid Token");
  }

  const user = await User.findById(id);

  if (!user) {
    return res.status(401).send("User Doesn't Exist");
  }

  const isBlocked = await redisClient.exists(`token:${token}`);

  if (isBlocked) {
    return res.status(401).send("Invalid Token");
  }

  req.user = user;

  next();
});

module.exports = userMiddleware;
