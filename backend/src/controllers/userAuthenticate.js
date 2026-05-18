const redisClient = require("../config/redis");
const User = require("../models/user");
const validate = require("../utils/validate");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const submission = require("../models/submission");
const asyncHandler = require("../utils/asyncHandler");

// REGISTER
const register = asyncHandler(async (req, res) => {
  // validate incoming user data before processing
  validate(req.body);

  // prevent users from self-registering as admin
  req.body.role = "user";

  // hash password before storing in database
  const { password } = req.body;
  req.body.password = await bcrypt.hash(password, 10);

  const user = await User.create(req.body);

  // user data sent back to frontend
  const reply = {
    firstName: user.firstName,
    emailId: user.emailId,
    _id: user._id,
    role: user.role,
  };

  // JWT payload stores identity and authorization-related data
  const token = jwt.sign(
    {
      id: user._id,
      emailId: user.emailId,
      role: user.role,
    },
    process.env.JWT_KEY,
    {
      expiresIn: "1d",
    },
  );

  // store JWT securely inside HTTP-only cookie
  res.cookie("token", token, {
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "strict",
  });

  res.status(201).json({
    user: reply,
    message: "Logged in Successfully",
  });
});

// LOGIN
const login = asyncHandler(async (req, res) => {
  const { emailId, password } = req.body;

  if (!emailId || !password) {
    throw new Error("Invalid Credentials");
  }

  // find user using email
  const user = await User.findOne({ emailId });

  if (!user) {
    throw new Error("Invalid Credentials");
  }

  // compare entered password with hashed password stored in DB
  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    throw new Error("Invalid Credentials");
  }

  // user data sent back to frontend
  const reply = {
    firstName: user.firstName,
    emailId: user.emailId,
    _id: user._id,
    role: user.role,
  };

  // JWT payload stores identity and authorization-related data
  const token = jwt.sign(
    {
      id: user._id,
      emailId: user.emailId,
      role: user.role,
    },
    process.env.JWT_KEY,
    {
      expiresIn: "1d",
    },
  );

  // HTTP-only cookie prevents frontend JS from accessing JWT
  res.cookie("token", token, {
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "strict",
  });

  res.status(201).json({
    user: reply,
    message: "Logged in Successfully",
  });
});

// LOGOUT
const logout = asyncHandler(async (req, res) => {
  const { token } = req.cookies;

  const payload = jwt.decode(token);

  await redisClient.set(`token:${token}`, "blocked");

  redisClient.expireAt(`token:${token}`, payload.exp);

  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });

  res.status(200).send("Logged Out Successfully");
});

// only allow existing admins to register new admins and also validate the request body for admin registration and hash the password before saving to database and send the JWT with role as "admin" in the payload
const adminRegister = asyncHandler(async (req, res) => {
  // validate the request body
  validate(req.body);

  // important to set the role before creating the user because admin will not be registered through this route and we are not allowing users to set their role by themselves so we will set the role as "admin" by default
  req.body.role = "admin";

  // extract the password from request body and hash it before saving to database
  const { password } = req.body;

  // hash the password
  req.body.password = await bcrypt.hash(password, 10);

  const user = await User.create(req.body);

  // send the JWT and assign the role to the user in the JWT payload so that we can use it in the future for authorization
  const token = jwt.sign(
    {
      id: user._id,
      emailId: user.emailId,
      role: "admin",
    },
    process.env.JWT_KEY,
    {
      expiresIn: 60 * 60,
    },
  );

  res.cookie("token", token, {
    maxAge: 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "strict",
  });

  res.status(201).send("Admin Registered Successfully");
});

const deleteProfile = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // delete From userSchema
  await User.findByIdAndDelete(userId);

  res.status(200).send("User deleted Successfully");
});

module.exports = {
  register,
  login,
  logout,
  adminRegister,
  deleteProfile,
};
