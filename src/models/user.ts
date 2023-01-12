import mongoose from "mongoose";

export enum USER_TYPES {
  CONSUMER = "consumer",
  SUPPORT = "support",
}

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
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
