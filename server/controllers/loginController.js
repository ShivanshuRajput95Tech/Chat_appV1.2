const bcrypt = require("bcrypt");
const { User, validateLogin } = require("../models/userModel.js");

const loginController = async (req, res) => {
  try {
    const { error } = validateLogin(req.body);
    if (error) {
      return res.status(400).send({ message: error.details[0].message });
    }

    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(401).send({ message: "Invalid Email" });
    }

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) {
      return res.status(401).send({ message: "Invalid Password" });
    }

    if (!user.verified) {
      return res.status(400).send({ message: "Please verify your email first" });
    }

    const token = user.generateAuthToken();

    return res
      .status(200)
      .cookie("authToken", token, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      })
      .send({ message: "Login successful", status: 200 });
  } catch (error) {
    console.error("Error in loginController:", error);
    return res.status(500).send({ message: "Internal Server Error" });
  }
};

module.exports = loginController;
