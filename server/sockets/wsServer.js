const ws = require("ws");
const jwt = require("jsonwebtoken");
const Message = require("../models/messageModel");
const { User } = require("../models/userModel");

const createWebSocketServer = (server) => {
  const wss = new ws.WebSocketServer({ server });
  const userConnections = new Map();

  const notifyAboutOnlinePeople = () => {
    const onlineUsers = Array.from(userConnections.entries()).map(([userId, client]) => ({
      userId,
      username: client.username,
      avatarLink: client.avatarLink || "",
    }));

    Array.from(wss.clients).forEach((client) => {
      if (client.readyState === ws.OPEN) {
        client.send(JSON.stringify({ online: onlineUsers }));
      }
    });
  };

  wss.on("connection", (connection, req) => {
    connection.timer = setInterval(() => {
      if (connection.readyState !== ws.OPEN) {
        clearInterval(connection.timer);
        return;
      }

      connection.ping();
      connection.deathTimer = setTimeout(() => {
        clearInterval(connection.timer);
        connection.terminate();
      }, 1000);
    }, 5000);

    connection.on("pong", () => clearTimeout(connection.deathTimer));

    const cookies = req.headers.cookie;
    if (cookies) {
      const tokenString = cookies
        .split(";")
        .map((str) => str.trim())
        .find((str) => str.startsWith("authToken="));

      if (tokenString) {
        const token = tokenString.split("=")[1];
        jwt.verify(token, process.env.JWTPRIVATEKEY, {}, async (err, userData) => {
          if (!err && userData) {
            const { _id, firstName, lastName } = userData;
            const dbUser = await User.findById(_id).select("avatarLink");

            connection.userId = _id;
            connection.username = `${firstName} ${lastName}`;
            connection.avatarLink = dbUser?.avatarLink || "";

            userConnections.set(String(_id), connection);
            notifyAboutOnlinePeople();
          }
        });
      }
    }

    connection.on("message", async (rawMessage) => {
      try {
        const messageData = JSON.parse(rawMessage.toString());

        if (messageData.type === "typing") {
          const { recipient, isTyping } = messageData;
          if (!connection.userId || !recipient) return;

          const recipientConnection = userConnections.get(String(recipient));
          if (recipientConnection?.readyState === ws.OPEN) {
            recipientConnection.send(
              JSON.stringify({
                type: "typing",
                sender: String(connection.userId),
                isTyping: Boolean(isTyping),
              })
            );
          }
          return;
        }

        const { recipient, text, clientTempId } = messageData;

        if (!connection.userId || !recipient || !text?.trim()) return;

        const msgDoc = await Message.create({
          sender: connection.userId,
          recipient,
          text: text.trim(),
        });

        const payload = JSON.stringify({
          _id: msgDoc._id,
          sender: connection.userId,
          recipient,
          text: text.trim(),
          createdAt: msgDoc.createdAt,
          clientTempId: clientTempId || null,
        });

        const senderConnection = userConnections.get(String(connection.userId));
        const recipientConnection = userConnections.get(String(recipient));

        if (senderConnection?.readyState === ws.OPEN) {
          senderConnection.send(payload);
        }

        if (recipientConnection?.readyState === ws.OPEN && recipientConnection !== senderConnection) {
          recipientConnection.send(payload);
        }
      } catch (error) {
        console.error("WebSocket message error:", error);
      }
    });

    connection.on("close", () => {
      clearInterval(connection.timer);
      clearTimeout(connection.deathTimer);

      if (connection.userId) {
        userConnections.delete(String(connection.userId));
      }

      notifyAboutOnlinePeople();
    });

    notifyAboutOnlinePeople();
  });
};

module.exports = createWebSocketServer;
