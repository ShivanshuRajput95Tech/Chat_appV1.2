const Message = require("../models/Message");

const saveMessage = async(sender, recipient, text) => {

    const message = await Message.create({
        sender,
        recipient,
        text
    });

    return message;

};

const getConversation = async(userA, userB) => {

    return Message.find({
        sender: { $in: [userA, userB] },
        recipient: { $in: [userA, userB] }
    }).sort({ createdAt: 1 });

};

module.exports = {
    saveMessage,
    getConversation
};