const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({

    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        index: true
    },

    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        index: true
    },

    text: {
        type: String,
        required: true
    },

    read: {
        type: Boolean,
        default: false,
        index: true
    }

}, { timestamps: true });

// Create composite index for faster queries
messageSchema.index({ sender: 1, recipient: 1, createdAt: -1 });
messageSchema.index({ recipient: 1, read: 1 });
messageSchema.index({ createdAt: -1 }); // For sorting

module.exports = mongoose.model("Message", messageSchema);