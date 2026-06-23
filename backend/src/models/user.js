const validator = require('validator');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { Schema } = mongoose;

const AUTH_CONFIG = require('../constants/authConstants');

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 20,
      match: [/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers and underscores'],
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
        message: 'Invalid email format',
      },

      index: true,
    },

    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },

    problemSolved: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: 'Problem',
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

    isVerified: {
      type: Boolean,
      default: false,
    },

    emailVerificationToken: {
      type: String,
    },

    emailVerificationTokenExpires: {
      type: Date,
    },

    bio: {
      type: String,
      trim: true,
      maxlength: 200,
      default: '',
    },

    institution: {
      type: String,
      trim: true,
      maxlength: 100,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.post('findOneAndDelete', async function (userInfo) {
  if (userInfo) {
    await mongoose.model('submission').deleteMany({
      userId: userInfo._id,
    });
  }
});

userSchema.methods.createResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  this.resetPasswordToken = hashedToken;
  this.resetPasswordExpires = Date.now() + AUTH_CONFIG.RESET_PASSWORD_TOKEN_EXPIRY;
  return resetToken;
};

userSchema.methods.createEmailVerificationToken = function () {
  const verificationToken = crypto.randomBytes(32).toString('hex');
  const hashedToken = crypto.createHash('sha256').update(verificationToken).digest('hex');
  this.emailVerificationToken = hashedToken;
  this.emailVerificationTokenExpires = Date.now() + AUTH_CONFIG.EMAIL_VERIFICATION_EXPIRY;
  return verificationToken;
};

const User = mongoose.model('user', userSchema);

module.exports = User;
