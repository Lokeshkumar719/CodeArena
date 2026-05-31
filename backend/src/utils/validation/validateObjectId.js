const mongoose = require("mongoose");

const STATUS_CODES = require(
  "../../constants/statusCodes",
);

const ApiError = require("../ApiError");

const validateObjectId = (id) => {
  if (!id) {
    throw new ApiError(
      STATUS_CODES.BAD_REQUEST,
      "Id is required",
    );
  }

  if (
    !mongoose.Types.ObjectId.isValid(id)
  ) {
    throw new ApiError(
      STATUS_CODES.BAD_REQUEST,
      "Invalid id",
    );
  }
};

module.exports = validateObjectId;