const WebSocket = require("ws");
const jwt = require("jsonwebtoken");

const clients = new Map();

const createWebSocketServer = (server) => {

    const wss = new WebSocket.Server({ server });

    wss.on("connection", (ws, req) => {

        const cookies = req.headers.cookie;

        if (!cookies) return;

        const token = cookies
            .split(";")
            .find(c => c.trim().startsWith("authToken="));

        if (!token) return;

        const tokenValue = token.split("=")[1];

        const userData = jwt.verify(
            tokenValue,
            process.env.JWTPRIVATEKEY
        );

        ws.userId = userData._id;

        clients.set(ws.userId, ws);

        broadcastOnlineUsers();

        ws.on("close", () => {

            clients.delete(ws.userId);

            broadcastOnlineUsers();

        });

    });

    function broadcastOnlineUsers() {

        const onlineUsers = [...clients.keys()];

        wss.clients.forEach(client => {

            client.send(JSON.stringify({
                type: "online",
                users: onlineUsers
            }));

        });

    }

};

module.exports = createWebSocketServer;