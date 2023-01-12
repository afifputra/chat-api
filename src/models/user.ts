import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

export enum USER_TYPES {
  CONSUMER = "consumer",
  SUPPORT = "support",
}

const userSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: () => uuidv4().replace(/\-/g, ""),
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: Object.values(USER_TYPES),
      required: true,
    },
  },
  {
    timestamps: true,
    collection: "users",
  }
);

export default mongoose.model("User", userSchema);
