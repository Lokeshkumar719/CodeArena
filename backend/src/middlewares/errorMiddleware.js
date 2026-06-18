const STATUS_CODES = require('../constants/statusCodes');

const errorMiddleware = (err, req, res, next) => {
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(STATUS_CODES.CONFLICT).json({
      success: false,
      message: `${field} already exists`,
    });
  }

  if (!err.statusCode || err.statusCode >= 500) {
    console.error(err);
  }

  return res.status(err.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
};

module.exports = errorMiddleware;
