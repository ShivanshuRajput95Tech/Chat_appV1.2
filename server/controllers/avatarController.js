const Avatar = require("../models/Avatar");

exports.createAvatar = async(req, res) => {

    try {

        const { link } = req.body;

        const avatar = new Avatar({ link });

        await avatar.save();

        res.json({
            message: "Avatar added",
            avatar
        });

    } catch (error) {

        res.status(500).json({ message: "Server error" });

    }

};

exports.getAvatars = async(req, res) => {

    const avatars = await Avatar.find();

    res.json(avatars);

};