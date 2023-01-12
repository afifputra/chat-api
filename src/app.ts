import * as http from "http";
import express from "express";
import cors from "cors";
import logger from "morgan";
import socketio from "socket.io";

import "./config/mongo";
import WebSockets from "./utils/WebSockets";

import indexRouter from "./routes/index";
import userRouter from "./routes/user";
import chatRoomRouter from "./routes/chatRoom";
import deleteRouter from "./routes/delete";

import { decode } from "./middlewares/jwt";

declare global {
  var io: socketio.Server;
}

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cors());

// Routes
app.use("/", indexRouter);
app.use("/users", userRouter);
app.use("/room", decode, chatRoomRouter);
app.use("/delete", deleteRouter);

app.use("*", (_, res) => {
  return res.status(404).json({ message: "Not Found" });
});

// Create Server
const server = http.createServer(app);
server.listen(7001, () => {
  console.log("Server listening on port 7001");
});

global.io = new socketio.Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

global.io.on("connection", WebSockets.connection);
