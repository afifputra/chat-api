import { Router } from "express";

const router = Router();

router.get("/"); // Get All Users

router.get("/:id"); // Get User By Id

router.post("/"); // Create User

router.delete("/:id"); // Delete User

export default router;
