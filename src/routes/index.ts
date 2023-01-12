import { Router } from "express";
import { body } from "express-validator";

import UserController from "../controllers/user";

const router = Router();

const loginValidators = [body("email").isEmail().normalizeEmail(), body("password").trim().isLength({ min: 6 })];

router.post("/login", loginValidators, UserController.onLogin);

export default router;
