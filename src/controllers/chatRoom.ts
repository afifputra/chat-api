import { RequestHandler } from "express";
import { validationResult } from "express-validator";

import ChatRoom from "../models/ChatRoom";

const initiate: RequestHandler = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const { userIds, type } = req.body;
  const { userId: chatInitiator } = req;
  const allUserIds = [...userIds, chatInitiator];

  try {
    const availableRoom = await ChatRoom.findOne({
      userIds: {
        $size: allUserIds.length,
        $all: [...allUserIds],
      },
    });

    if (availableRoom) {
      return res.status(200).json({
        isNew: false,
        message: "retreiving an old chat room",
        chatRoomId: availableRoom._id,
        type: availableRoom.type,
      });
    }

    const newChatRoom = await ChatRoom.create({
      userIds: allUserIds,
      type,
      chatInitiator,
    });

    return res.status(200).json({
      isNew: true,
      message: "creating a new chat room",
      chatRoomId: newChatRoom._id,
      type: newChatRoom.type,
    });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

const postMessage: RequestHandler = (_, __) => {};

const getRecentConversation: RequestHandler = (_, __) => {};

const getConversationRoom: RequestHandler = (_, __) => {};

const markConversationReadByRoomId: RequestHandler = (_, __) => {};

export default { initiate, postMessage, getRecentConversation, getConversationRoom, markConversationReadByRoomId };
