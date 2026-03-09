const { User } = require("../models/userModel.js");
const { Token } = require("../models/tokenModel.js");

const verifyEmail = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(400).send({ message: "User doesn't exist" });
    }

    if (user.verified) {
      return res.status(400).send({ message: "Email already verified" });
    }

    const token = await Token.findOne({
      userId: user._id,
      token: req.params.token,
    });

    if (!token) {
      return res.status(400).send({ message: "Invalid Link" });
    }

    if (token.expiresAt < Date.now()) {
      user.verificationLinkSent = false;
      await user.save();
      await Token.deleteOne({ _id: token._id });
      return res.status(400).send({ message: "Verification link expired" });
    }

    user.verified = true;
    user.verificationLinkSent = false;
    await user.save();
    await Token.deleteOne({ _id: token._id });

    return res.status(200).send({ message: "Email Verified Successfully" });
  } catch (error) {
    console.error("Error in verifyEmail:", error);
    return res.status(500).send({ message: "Internal Server Error" });
  }
};

module.exports = verifyEmail;
