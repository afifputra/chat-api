import { RequestHandler } from "express";
import jwt from "jsonwebtoken";

const SECRET_KEY = "rimurutempest";

const decode: RequestHandler = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authorization.split(" ")[1];

  try {
    const decoded = jwt.verify(token, SECRET_KEY);

    req.body = decoded;

    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

export { decode, SECRET_KEY };
