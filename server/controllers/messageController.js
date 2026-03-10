const protect = require("../middleware/protect");
const Message = require("../models/messageModel");

const messageController = async (req, res) => {
  try {
    const { userId } = req.params;
    const userData = await protect(req);
    const ourUserId = userData._id;

    const messages = await Message.find({
      sender: { $in: [userId, ourUserId] },
      recipient: { $in: [userId, ourUserId] },
    }).sort({ createdAt: 1 });

    return res.json(messages);
  } catch (error) {
    console.error("Error in messageController:", error);
    return res.status(401).json({ message: "Unauthorized" });
  }
};

module.exports = messageController;
