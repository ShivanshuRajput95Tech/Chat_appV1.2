require("dotenv").config();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const compression = require("compression");
const { Server } = require("socket.io");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const messageRoutes = require("./routes/messageRoutes");

const app = express();

connectDB();

app.use(express.json());
app.use(cookieParser());

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use(compression());

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

const PORT = process.env.PORT || 4000;

const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        credentials: true
    }
});

const onlineUsers = new Map();

io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
        return next(new Error('Authentication error'));
    }
    try {
        const jwt = require("jsonwebtoken");
        const userData = jwt.verify(token, process.env.JWTPRIVATEKEY);
        socket.userId = userData._id;
        next();
    } catch (error) {
        next(new Error('Authentication error'));
    }
});

io.on("connection", (socket) => {
    console.log("User connected:", socket.id, socket.userId);

    onlineUsers.set(socket.userId, socket.id);
    io.emit("onlineUsers", Array.from(onlineUsers.keys()));

    socket.on("sendMessage", (data) => {
        // Handle message sending
        // Assuming data has receiverId, message
        const receiverSocket = onlineUsers.get(data.receiverId);
        if (receiverSocket) {
            io.to(receiverSocket).emit("receiveMessage", {
                senderId: socket.userId,
                message: data.message
            });
        }
    });

    socket.on("typing", (data) => {
        const receiverSocket = onlineUsers.get(data.receiverId);
        if (receiverSocket) {
            io.to(receiverSocket).emit("userTyping", { senderId: socket.userId });
        }
    });

    socket.on("stopTyping", (data) => {
        const receiverSocket = onlineUsers.get(data.receiverId);
        if (receiverSocket) {
            io.to(receiverSocket).emit("userStopTyping", { senderId: socket.userId });
        }
    });

    socket.on("disconnect", () => {
        if (socket.userId) {
            onlineUsers.delete(socket.userId);
            io.emit("onlineUsers", Array.from(onlineUsers.keys()));
        }
        console.log("User disconnected:", socket.id);
    });
});