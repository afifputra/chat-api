import { RequestHandler } from "express";
import jwt from "jsonwebtoken";

import { USER_TYPES } from "../models/user";

const SECRET_KEY = "rimurutempest";

const decode: RequestHandler = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authorization.split(" ")[1];

  try {
    const decoded = jwt.verify(token, SECRET_KEY) as { id: string; type: USER_TYPES };

    req.userId = decoded.id;
    req.userType = decoded.type;

    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

export { decode, SECRET_KEY };
