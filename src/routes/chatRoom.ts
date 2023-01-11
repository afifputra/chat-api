import { Router } from "express";

const router = Router();

router.get("/"); // Get Recent Chats

router.get("/:roomId"); // Get Conversation By Room Id

router.post("/initiate"); // Initiate Chat

router.post("/:roomId/message"); // Send Message

router.put("/:roomId/mark-read"); // Mark Conversation Read

export default router;
