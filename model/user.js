const Joi = require("joi");
const mongoose = require("mongoose");

// creating a user schema object
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "username is required"],
      minlength: [5, "Username must be at least 5 characters long"],
      maxlength: [30, "Username cannot exceed 30 characters"],
    },
    email: {
      type: String,
      unique: true,
      required: [true, "username is required"],
      validate: {
        validator: function (v) {
          return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v);
        },
        message: (props) => `${props.value} is not a valid email address!`,
      },
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    otp: {
      type: String,
    },
    otpExpiresIn: {
      type: String,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// creating a user model
const User = mongoose.model("User", userSchema);

// A costuom user Validator
const userValidator = (user) => {
  const Schema = Joi.object({
    name: Joi.string().min(5).max(50).required(),
    email: Joi.string()
      .email({ tlds: { allow: true } })
      .required(),
    phone: Joi.string()
      .pattern(/^\+?\d{1,3}?\d{7,14}$/)
      .required(),
    otp: Joi.string(),
    otpExpiresIn: Joi.string(),
    isAdmin: Joi.boolean(),
  });
  return Schema.validate(user);
};

module.exports = { User, userValidator };
