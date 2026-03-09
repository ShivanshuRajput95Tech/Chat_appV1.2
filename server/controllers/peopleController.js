const User = require("../models/User");

exports.getPeople = async(req, res) => {

    const users = await User.find();

    res.json(users);

};