import mongoose from "mongoose";

export enum CHAT_MESSAGE_TYPES {
  TYPE_TEXT = "text",
}

const readByRecepientSchema = new mongoose.Schema(
  {
    readByUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    readAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: false,
  }
);

const chatMessageSchema = new mongoose.Schema(
  {
    chatRoomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ChatRoom",
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: Object.values(CHAT_MESSAGE_TYPES),
      required: true,
    },
    postedByUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    readByRecipients: [readByRecepientSchema],
  },
  {
    timestamps: true,
    collection: "chatmessages",
  }
);

export default mongoose.model("ChatMessage", chatMessageSchema);
