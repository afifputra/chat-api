import { RequestHandler } from "express";
import { validationResult } from "express-validator";
import bcrypt from "bcryptjs";

import User from "../models/user";

const onGetAllUsers: RequestHandler = (_, __) => {};

const onGetUserById: RequestHandler = (_, __) => {};

const onCreateUser: RequestHandler = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const { firstName, lastName, email, password, type } = req.body;

  const existingEmail = await User.findOne({ email });

  if (existingEmail) {
    return res.status(422).json({ message: "Email already exists" });
  }

  const encryptedPassword = await bcrypt.hash(password, 12);

  const user = new User({
    firstName,
    lastName,
    email,
    password: encryptedPassword,
    type,
  });

  try {
    await user.save();

    return res.status(201).json({ message: "User created" });
  } catch (err) {
    return res.status(500).json({ message: "Creating user failed" });
  }
};

const onDeleteUser: RequestHandler = (_, __) => {};

export default { onGetAllUsers, onGetUserById, onCreateUser, onDeleteUser };
