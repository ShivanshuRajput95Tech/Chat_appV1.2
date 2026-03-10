require("dotenv").config();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
const http = require("http");

const app = express();
const connection = require("./db/db.js");
const userRoute = require("./routes/userRoute.js");
const avatarRoute = require("./routes/avatarRoutes.js");
const createWebSocketServer = require("./sockets/wsServer.js");

connection();

app.use(express.json());
app.use(cookieParser());

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:4000",
  "https://swifty-chatty-appy.onrender.com",
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
  credentials: true,
};

app.use(cors(corsOptions));

app.use("/api/user", userRoute);
app.use("/api/avatar", avatarRoute);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "..", "frontend", "dist")));
  app.get("/*", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "frontend", "dist", "index.html"));
  });
}

const port = process.env.PORT || 4000;
const server = http.createServer(app);
createWebSocketServer(server);

server.listen(port, () => console.log(`Application Running on port ${port}`));
