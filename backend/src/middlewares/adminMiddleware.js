const asyncHandler = require("../utils/asyncHandler");

// this middleware only checks whether authenticated user is admin or not
const adminMiddleware = asyncHandler(async (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).send("Access Denied");
  }

  next();
});

module.exports = adminMiddleware;