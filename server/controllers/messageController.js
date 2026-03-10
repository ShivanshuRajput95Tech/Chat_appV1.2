const Message = require("../models/Message");
const User = require("../models/User");
const mongoose = require("mongoose");

exports.getMessages = async(req, res) => {

    const { userId } = req.params;
    const { page = 1, limit = 50 } = req.query;
    const ourUserId = req.user._id;

    try {
        // Mark messages from the other user as read (async, don't wait)
        Message.updateMany({
            sender: userId,
            recipient: ourUserId,
            read: false
        }, { read: true }).catch(err => console.error('Read update error:', err));

        // Calculate pagination
        const skip = (page - 1) * limit;

        // Use aggregation pipeline for better performance
        const messages = await Message.aggregate([
            {
                $match: {
                    $or: [
                        { sender: mongoose.Types.ObjectId(ourUserId), recipient: mongoose.Types.ObjectId(userId) },
                        { sender: mongoose.Types.ObjectId(userId), recipient: mongoose.Types.ObjectId(ourUserId) }
                    ]
                }
            },
            { $sort: { createdAt: -1 } },
            { $skip: skip },
            { $limit: parseInt(limit) },
            {
                $lookup: {
                    from: "users",
                    localField: "sender",
                    foreignField: "_id",
                    as: "senderData"
                }
            },
            { $unwind: { path: "$senderData", preserveNullAndEmptyArrays: true } },
            {
                $project: {
                    _id: 1,
                    text: 1,
                    read: 1,
                    createdAt: 1,
                    sender: 1,
                    recipient: 1,
                    "senderData.firstName": 1,
                    "senderData.lastName": 1,
                    "senderData.avatar": 1
                }
            },
            { $sort: { createdAt: 1 } }
        ]);

        // Get total count for pagination info
        const total = await Message.countDocuments({
            $or: [
                { sender: ourUserId, recipient: userId },
                { sender: userId, recipient: ourUserId }
            ]
        });

        res.json({
            messages,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ error: 'Failed to fetch messages' });
    }

};

exports.getUnreadCounts = async(req, res) => {

    const ourUserId = req.user._id;

    try {
        const unreadCounts = await Message.aggregate([
            { $match: { recipient: mongoose.Types.ObjectId(ourUserId), read: false } },
            { $group: { _id: "$sender", count: { $sum: 1 } } }
        ]);

        res.json(unreadCounts);
    } catch (error) {
        console.error('Error getting unread counts:', error);
        res.status(500).json({ error: 'Failed to fetch unread counts' });
    }

};