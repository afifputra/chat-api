import { Router } from "express";

const router = Router();

router.delete("/:roomId"); // Delete Conversation By Room Id

router.delete("/message/:messageId"); // Delete Message By Message Id

export default router;
