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

chatRoomSchema.statics.initiateChat = async function (userIds: string[], type: CHAT_ROOM_TYPES, chatInitiator: string) {
  try {
    const availableRoom = await this.findOne({
      userIds: {
        $size: userIds.length,
        $all: [...userIds],
      },
      type,
    });

    if (availableRoom) {
      return {
        isNew: false,
        message: "retreiving an old chat room",
        chatRoomId: availableRoom._id,
        type: availableRoom.type,
      };
    }

    const newChatRoom = await this.create({
      userIds,
      type,
      chatInitiator,
    });

    return {
      isNew: true,
      message: "creating a new chat room",
      chatRoomId: newChatRoom._id,
      type: newChatRoom.type,
    };
  } catch (error) {
    throw error;
  }
};

export default mongoose.model("ChatRoom", chatRoomSchema);
