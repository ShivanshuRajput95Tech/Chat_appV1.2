const jwt = require("jsonwebtoken");
const { User } = require("../models/userModel");

const profileController = async (req, res) => {
  const token = req.cookies?.authToken;
  if (!token) {
    return res.status(401).json("no token");
  }

  return jwt.verify(token, process.env.JWTPRIVATEKEY, {}, async (err, userData) => {
    if (err) {
      return res.status(401).json("invalid token");
    }

    const user = await User.findOne({ _id: userData._id });
    return res.json(user);
  });
};

const profileUpdate = async (req, res) => {
  const token = req.cookies?.authToken;
  if (!token) {
    return res.status(401).json("no token");
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWTPRIVATEKEY);
  } catch (err) {
    return res.status(401).json("invalid token");
  }

  const { firstName, lastName, email, avatarLink } = req.body;
  const user = await User.findOne({ _id: decoded._id, email });

  if (!user) {
    return res.status(404).json("user not found");
  }

  user.firstName = firstName;
  user.lastName = lastName;
  user.email = email;
  user.avatarLink = avatarLink;
  await user.save();

  return res.json(user);
};

module.exports = { profileController, profileUpdate };
