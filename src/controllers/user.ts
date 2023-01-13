import { RequestHandler } from "express";
import { validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/user";
import { SECRET_KEY } from "../middlewares/jwt";

const onGetAllUsers: RequestHandler = async (_, res) => {
  try {
    const users = await User.find();

    return res.status(200).json(users);
  } catch (err) {
    return res.status(500).json({ message: "Fetching users failed" });
  }
};

const onGetUserById: RequestHandler = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  } catch (err) {
    return res.status(500).json({ message: "Fetching user failed" });
  }
};

const onCreateUser: RequestHandler = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const { firstName, lastName, email, password, type } = req.body;
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

const onDeleteUser: RequestHandler = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await User.deleteOne({ _id: id });

    return res.status(200).json({ message: "User deleted" });
  } catch (err) {
    return res.status(500).json({ message: "Deleting user failed" });
  }
};

const onLogin: RequestHandler = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const token = jwt.sign(
      {
        id: user._id,
        type: user.type,
      },
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    return res.status(200).json({ token });
  } catch (err) {
    return res.status(500).json({ message: "Encoding user failed" });
  }
};

export default { onGetAllUsers, onGetUserById, onCreateUser, onDeleteUser, onLogin };
