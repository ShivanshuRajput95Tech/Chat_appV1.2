const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { User, validateRegister } = require("../models/userModel");
const { Token } = require("../models/tokenModel");

const registerController = async (req, res) => {
  try {
    const { error } = validateRegister(req.body);
    if (error) {
      return res.status(400).send({ message: error.details[0].message });
    }

    let user = await User.findOne({ email: req.body.email });

    if (user && user.verified) {
      return res.status(409).send({ message: "User with given email already exists" });
    }

    if (user && user.verificationLinkSent) {
      return res.status(400).send({
        message: "A verification link has already been sent to this email.",
      });
    }

    const salt = await bcrypt.genSalt(Number(process.env.SALT) || 10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    user =
      user ||
      (await new User({
        ...req.body,
        password: hashPassword,
      }).save());

    const token = await new Token({
      userId: user._id,
      token: crypto.randomBytes(16).toString("hex"),
      createdAt: Date.now(),
      expiresAt: Date.now() + 3600000,
    }).save();

    user.verificationLinkSent = true;
    await user.save();

    const verificationPath = `/api/user/${user._id}/verify/${token.token}`;

    return res.status(201).send({
      message: `Verification Email Sent to ${user.email}`,
      verificationPath,
    });
  } catch (error) {
    console.error("Error in registerController:", error);
    return res.status(500).send({ message: "Internal Server Error" });
  }
};

module.exports = registerController;
