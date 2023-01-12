import { Router } from "express";
import { body } from "express-validator";

import userController from "../controllers/user";
import { USER_TYPES } from "../models/user";

const router = Router();

const creatUserValidators = [
  body("firstName").trim().isLength({ min: 3 }),
  body("lastName").trim().isLength({ min: 3 }),
  body("email").isEmail().normalizeEmail(),
  body("password").trim().isLength({ min: 6 }),
  body("type").isIn(Object.values(USER_TYPES)),
];

router.get("/"); // Get All Users

router.get("/:id"); // Get User By Id

router.post("/", creatUserValidators, userController.onCreateUser); // Create User

router.delete("/:id"); // Delete User

export default router;
