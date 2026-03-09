const express = require("express");

const router = express.Router();

const {
    createAvatar,
    getAvatars
} = require("../controllers/avatarController");

router.post("/", createAvatar);

router.get("/", getAvatars);

module.exports = router;