const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    verified: { type: Boolean, default: false },
    verificationLinkSent: { type: Boolean, default: false },
    avatarLink: { type: String, default: "" },
  },
  { timestamps: true }
);

userSchema.methods.generateAuthToken = function generateAuthToken() {
  return jwt.sign(
    {
      _id: this._id,
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
    },
    process.env.JWTPRIVATEKEY,
    { expiresIn: "7d" }
  );
};

const User = mongoose.model("user", userSchema);

const validateRegister = (data) => {
  const schema = Joi.object({
    firstName: Joi.string().trim().required().label("First Name"),
    lastName: Joi.string().trim().required().label("Last Name"),
    email: Joi.string().email().trim().required().label("Email"),
    password: Joi.string().min(8).required().label("Password"),
  });
  return schema.validate(data);
};

const validateLogin = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().trim().required().label("Email"),
    password: Joi.string().required().label("Password"),
  });
  return schema.validate(data);
};

module.exports = { User, validateRegister, validateLogin };
