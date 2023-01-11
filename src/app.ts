import * as http from "http";
import express from "express";
import cors from "cors";
import logger from "morgan";

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cors());

app.use("*", (_, res) => {
  return res.status(404).json({ message: "Not Found" });
});

// Create Server
const server = http.createServer(app);
server.listen(3000, () => {
  console.log("Server listening on port 3000");
});
