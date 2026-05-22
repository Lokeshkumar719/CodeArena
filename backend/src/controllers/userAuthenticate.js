const { redisClient } = require("../config/redis");
const User = require("../models/user");
const validate = require("../utils/validate");
const bcrypt = require("bcrypt");
const jwt=require("jsonwebtoken");
const asyncHandler = require("../utils/asyncHandler");
const sendTokenResponse = require("../utils/sendTokenResponse");
const STATUS_CODES = require("../constants/statusCodes");
const ApiError = require("../utils/ApiError");

// REGISTER
const register = asyncHandler(async (req, res) => {
  // validate incoming user data before processing
  await validate(req.body);

  // prevent users from self-registering as admin
  req.body.role = "user";

  // hash password before storing in database
  const { password } = req.body;

  //   bcrypt.hash() internally does BOTH:
  // 1. generate salt
  // 2. hash password using that salt
  req.body.password = await bcrypt.hash(password, 10);

  const user = await User.create(req.body);

  // user data sent back to frontend
  return sendTokenResponse(
    res,
    user,
    "User registered successfully",
    STATUS_CODES.CREATED,
  );
});

// LOGIN
const login = asyncHandler(async (req, res) => {
  const { emailId, password } = req.body;

  if (!emailId || !password) {
    throw new ApiError(
      STATUS_CODES.BAD_REQUEST,
      "Email and password are required",
    );
  }

  // find user using email
  const user = await User.findOne({ emailId });

  if (!user) {
    throw new ApiError(STATUS_CODES.UNAUTHORIZED, "Invalid credentials");
  }

  // compare entered password with hashed password stored in DB
  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    throw new ApiError(STATUS_CODES.UNAUTHORIZED, "Invalid credentials");
  }

  return sendTokenResponse(
    res,
    user,
    "User logged in successfully",
    STATUS_CODES.OK,
  );
});

// LOGOUT
const logout = asyncHandler(async (req, res) => {
  const { token } = req.cookies;

  if (!token) {
    throw new ApiError(STATUS_CODES.UNAUTHORIZED, "User is not logged in");
  }

  const payload = jwt.verify(token, process.env.JWT_KEY);

  await redisClient.set(`token:${token}`, "blocked");

  redisClient.expireAt(`token:${token}`, payload.exp);

  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
    sameSite: "strict",
  });

  return res.status(STATUS_CODES.OK).json({
    success: true,
    message: "User logged out successfully",
  });
});

// only allow existing admins to register new admins and also validate the request body for admin registration and hash the password before saving to database and send the JWT with role as "admin" in the payload
const adminRegister = asyncHandler(async (req, res) => {
  // validate the request body
  validate(req.body);

  // prevent users from setting roles manually
  req.body.role = "admin";

  // extract the password from request body
  const { password } = req.body;

  // hash the password before storing in database
  req.body.password = await bcrypt.hash(password, 10);

  const user = await User.create(req.body);

  // send useful user data back to frontend
  return sendTokenResponse(
    res,
    user,
    "Admin registered successfully",
    STATUS_CODES.CREATED,
  );
});

const deleteProfile = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  // delete user from database
  await User.findByIdAndDelete(userId);
  return res.status(STATUS_CODES.OK).json({
    success: true,
    message: "User deleted successfully",
  });
});

module.exports = {
  register,
  login,
  logout,
  adminRegister,
  deleteProfile,
};