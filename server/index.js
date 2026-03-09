require("dotenv").config({ path: "./.env" });
console.log("MONGO_URI:", process.env.MONGO_URI);
const express = require("express");
const cors = require("cors");
const app = express();
const connection = require("./db/db.js");
const userRoute = require("./routes/userRoute.js");
const cookieParser = require('cookie-parser')
const { Server } = require("socket.io");
const http = require('http');
//database connection
connection();
app.use(express.json())
app.use(cookieParser())
    //middlewares
app.use(express.json());
const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:7000",
    "https://swifty-chatty-appy.onrender.com"
];
const corsOptions = {
    origin: (origin, callback) => {
        if (allowedOrigins.includes(origin) || !origin) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    optionsSuccessStatus: 204,
    credentials: true, // Allow credentials like cookies
};
app.use(cors(corsOptions));
app.use("/api/user", userRoute);
const port = process.env.PORT || 8000;
const server = http.createServer(app);
const io = new Server(server, {
    cors: corsOptions
});

io.on('connection', (socket) => {
    console.log('a user connected', socket.id);

    // Authenticate user
    const cookies = socket.handshake.headers.cookie;
    if (cookies) {
        const tokenString = cookies.split(';').find(str => str.trim().startsWith('authToken='));
        if (tokenString) {
            const token = tokenString.split('=')[1];
            const jwt = require("jsonwebtoken");
            jwt.verify(token, process.env.JWTPRIVATEKEY, {}, (err, userData) => {
                if (!err) {
                    socket.userId = userData._id;
                    socket.username = `${userData.firstName} ${userData.lastName}`;
                }
            });
        }
    }

    socket.on('disconnect', () => {
        console.log('user disconnected', socket.id);
        // Notify online users
        const onlineUsers = Array.from(io.sockets.sockets.values())
            .filter(s => s.userId)
            .map(s => ({ userId: s.userId, username: s.username || 'Unknown' }));
        io.emit('onlineUsers', onlineUsers);
    });

    // Handle user online
    socket.on('user_online', () => {
        // Broadcast online users
        const onlineUsers = Array.from(io.sockets.sockets.values())
            .filter(s => s.userId)
            .map(s => ({ userId: s.userId, username: s.username || 'Unknown' }));
        io.emit('onlineUsers', onlineUsers);
    });

    // Handle sending message
    socket.on('sendMessage', async(data) => {
        const { recipient, text } = data;
        if (!socket.userId) return;
        // Save message to DB
        const Message = require("./models/messageModel");
        try {
            const msgDoc = await Message.create({
                sender: socket.userId,
                recipient,
                text,
            });
            // Send to recipient
            const recipientSocket = Array.from(io.sockets.sockets.values()).find(s => s.userId === recipient);
            if (recipientSocket) {
                recipientSocket.emit('receiveMessage', {
                    sender: socket.username,
                    text,
                    id: msgDoc._id,
                });
            }
        } catch (err) {
            console.error('Error saving message:', err);
        }
    });
});

server.listen(port, () => console.log(`Application Running on port ${port}`));