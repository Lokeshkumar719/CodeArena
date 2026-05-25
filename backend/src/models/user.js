const validator = require("validator");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { Schema } = mongoose;


const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 20,
      trim: true,
    },

    lastName: {
      type: String,
      minLength: 3,
      maxLength: 20,
      trim: true,
    },

    emailId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      immutable: true,

      validate: {
        validator: validator.isEmail,
        message: "Invalid email format",
      },

      index: true,
    },

    age: {
      type: Number,
      min: 5,
      max: 80,
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    problemSolved: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "Problem",
        },
      ],

      default: [],
    },

    password: {
      type: String,
      required: true,
    },

    resetPasswordToken: {
      type: String,
    },

    resetPasswordExpires: {
      type: Date,
    },
  },

  {
    timestamps: true,
  },
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }
  this.password = await bcrypt.hash(
    this.password,
    10,
  );
}); 

userSchema.post("findOneAndDelete", async function (userInfo) {
  if (userInfo) {
    await mongoose.model("submission").deleteMany({
      userId: userInfo._id,
    });
  }
});

userSchema.methods.createResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordToken = hashedToken;

  this.resetPasswordExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model("user", userSchema);

module.exports = User;
