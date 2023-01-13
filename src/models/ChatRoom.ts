import mongoose from "mongoose";

export enum CHAT_ROOM_TYPES {
  CONSUMER_TO_CONSUMER = "consumer_to_consumer",
  CONSUMER_TO_SUPPORT = "consumer_to_support",
}

const chatRoomSchema = new mongoose.Schema(
  {
    userIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    type: {
      type: String,
      enum: Object.values(CHAT_ROOM_TYPES),
      required: true,
    },
    chatInitiator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
    collection: "chatrooms",
  }
);

export default mongoose.model("ChatRoom", chatRoomSchema);
