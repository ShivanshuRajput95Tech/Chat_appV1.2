const Message = require("../models/Message");
const User = require("../models/User");

exports.getMessages = async(req, res) => {

    const { userId } = req.params;

    const ourUserId = req.user._id;

    // Mark messages from the other user as read
    await Message.updateMany({
        sender: userId,
        recipient: ourUserId,
        read: false
    }, { read: true });

    const messages = await Message.find({
        sender: { $in: [ourUserId, userId] },
        recipient: { $in: [ourUserId, userId] }
    }).sort({ createdAt: 1 });

    res.json(messages);

};

exports.getUnreadCounts = async(req, res) => {

    const ourUserId = req.user._id;

    const unreadCounts = await Message.aggregate([
        { $match: { recipient: ourUserId, read: false } },
        { $group: { _id: "$sender", count: { $sum: 1 } } }
    ]);

    res.json(unreadCounts);

};