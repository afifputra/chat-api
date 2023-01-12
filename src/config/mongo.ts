import mongoose from "mongoose";
import config from "./index";

const { name, password, username } = config.db;

const CONNECTION_URL = `mongodb+srv://${username}:${password}@cluster0.5fapyff.mongodb.net/${name}?retryWrites=true&w=majority`;

mongoose.set("strictQuery", true);
(async () => {
  try {
    await mongoose.connect(CONNECTION_URL);

    mongoose.connection.on("connected", () => {
      console.log("Mongoose connected to db");
    });

    mongoose.connection.on("reconnect", () => {
      console.log("Mongoose reconnected to db");
    });

    mongoose.connection.on("error", (error) => {
      console.log("Mongoose connection error", error);
    });

    mongoose.connection.on("disconnected", () => {
      console.log("Mongoose disconnected from db");
    });
  } catch (error) {
    console.log(error);
  }
})();
