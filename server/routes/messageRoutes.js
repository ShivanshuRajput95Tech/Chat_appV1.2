const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
    getMessages,
    getUnreadCounts
} = require("../controllers/messageController");

router.get("/:userId", authMiddleware, getMessages);
router.get("/unread/counts", authMiddleware, getUnreadCounts);

module.exports = router;