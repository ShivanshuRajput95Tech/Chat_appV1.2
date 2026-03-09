const mongoose = require("mongoose");

const avatarSchema = new mongoose.Schema({

    link: {
        type: String,
        required: true
    }

});

module.exports = mongoose.model("Avatar", avatarSchema);