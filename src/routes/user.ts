import { Router } from "express";
import { body } from "express-validator";

import userController from "../controllers/user";
import User, { USER_TYPES } from "../models/user";

const router = Router();

const creatUserValidators = [
  body("firstName").trim().isLength({ min: 3 }),
  body("lastName").trim().isLength({ min: 3 }),
  body("email")
    .isEmail()
    .normalizeEmail()
    .custom(async (value) => {
      const existingEmail = await User.findOne({ email: value });
      if (existingEmail) {
        return Promise.reject("Email already exists");
      }
    }),
  body("password").trim().isLength({ min: 6 }),
  body("type").isIn(Object.values(USER_TYPES)),
];

router.get("/", userController.onGetAllUsers); // Get All Users

router.get("/:id", userController.onGetUserById); // Get User By Id

router.post("/", creatUserValidators, userController.onCreateUser); // Create User

router.delete("/:id", userController.onDeleteUser); // Delete User

export default router;
