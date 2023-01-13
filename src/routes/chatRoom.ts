import { Router } from "express";
import { body } from "express-validator";

import { CHAT_ROOM_TYPES } from "../models/ChatRoom";
import ChatRoomController from "../controllers/chatRoom";

const initiateChatValidators = [
  body("userIds")
    .isArray()
    .isLength({ min: 1 })
    .custom((value) => {
      return value.length === new Set(value).size;
    }),
  body("type").isIn(Object.values(CHAT_ROOM_TYPES)),
];

const postMessageValidators = [body("message").isString().isLength({ min: 1 })];

const router = Router();

router.get("/"); // Get Recent Chats

router.get("/:roomId"); // Get Conversation By Room Id

router.post("/initiate", initiateChatValidators, ChatRoomController.initiate); // Initiate Chat

router.post("/:roomId/message", postMessageValidators, ChatRoomController.postMessage); // Send Message

router.put("/:roomId/mark-read"); // Mark Conversation Read

export default router;
