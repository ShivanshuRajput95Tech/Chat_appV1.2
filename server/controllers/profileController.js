const User = require("../models/User");

exports.getProfile = async(req, res) => {

    const user = await User.findById(req.user._id);

    res.json(user);

};

exports.updateProfile = async(req, res) => {

    const { firstName, lastName, avatarLink } = req.body;

    const user = await User.findById(req.user._id);

    user.firstName = firstName;
    user.lastName = lastName;
    user.avatarLink = avatarLink;

    await user.save();

    res.json(user);

};