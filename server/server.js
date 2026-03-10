require("dotenv").config();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const compression = require("compression");
const { Server } = require("socket.io");

const connectDB = require("./config/db");
const errorMiddleware = require("./middleware/errorMiddleware");

const authRoutes = require("./routes/authRoutes");
const messageRoutes = require("./routes/messageRoutes");

const app = express();

connectDB();

app.use(express.json());
app.use(cookieParser());

app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
    optionsSuccessStatus: 200
}));
app.use(compression());

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
    res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// Error handling middleware - must be last
app.use(errorMiddleware);

const PORT = process.env.PORT || 4000;

const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:5173",
        credentials: true,
        optionsSuccessStatus: 200
    },
    transports: ['websocket', 'polling'],
    pingTimeout: 60000,
    pingInterval: 25000,
    maxHttpBufferSize: 1e6 // 1MB max message size
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
    
    // Join user to their own room for direct messaging
    socket.join(`user_${socket.userId}`);
    
    // Emit to specific users instead of broadcasting to all (optimization)
    const onlineList = Array.from(onlineUsers.keys());
    io.emit("onlineUsers", onlineList);

    socket.on("sendMessage", (data) => {
        // Handle message sending with room-based delivery
        const receiverSocketId = onlineUsers.get(data.receiverId);
        if (receiverSocketId) {
            // Only send to the specific receiver
            io.to(`user_${data.receiverId}`).emit("receiveMessage", {
                senderId: socket.userId,
                message: data.message,
                timestamp: new Date()
            });
        }
    });

    socket.on("typing", (data) => {
        const receiverSocketId = onlineUsers.get(data.receiverId);
        if (receiverSocketId) {
            io.to(`user_${data.receiverId}`).emit("userTyping", { senderId: socket.userId });
        }
    });

    socket.on("stopTyping", (data) => {
        const receiverSocketId = onlineUsers.get(data.receiverId);
        if (receiverSocketId) {
            io.to(`user_${data.receiverId}`).emit("userStopTyping", { senderId: socket.userId });
        }
    });

    socket.on("disconnect", () => {
        if (socket.userId) {
            onlineUsers.delete(socket.userId);
            socket.leave(`user_${socket.userId}`);
            // Only notify others about disconnect, don't send full list
            io.emit("userOffline", { userId: socket.userId });
        }
        console.log("User disconnected:", socket.id);
    });
});