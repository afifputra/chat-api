import { RequestHandler } from "express";
import { validationResult } from "express-validator";

import User from "../models/user";
import ChatRoom from "../models/ChatRoom";
import ChatMessage, { CHAT_MESSAGE_TYPES } from "../models/ChatMessage";

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

const postMessage: RequestHandler = async (req, res) => {
  const { roomId } = req.params;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const { message } = req.body;
  const currentLoggedUserId = req.userId;

  try {
    const chatRoom = await ChatRoom.findById(roomId);

    if (!chatRoom) {
      return res.status(404).json({ message: "Chat room not found" });
    }
    const post = await ChatMessage.create({
      chatRoomId: roomId,
      message,
      type: CHAT_MESSAGE_TYPES.TYPE_TEXT,
      postedByUser: currentLoggedUserId,
    });

    const postData = await ChatMessage.aggregate([
      // get post where _id is equal to the post._id
      { $match: { _id: post._id } },
      // do join on another collection called users, and
      // get the user where _id is equal to the postedByUser
      {
        $lookup: {
          from: "users",
          localField: "postedByUser",
          foreignField: "_id",
          as: "postedByUser",
        },
      },
      {
        $unwind: "$postedByUser",
      },
      // do join on another collection called chatrooms, and
      // get the chatroom where _id is equal to the chatRoomId
      {
        $lookup: {
          from: "chatrooms",
          localField: "chatRoomId",
          foreignField: "_id",
          as: "chatRoomInfo",
        },
      },
      { $unwind: "$chatRoomInfo" },
      { $unwind: "$chatRoomInfo.userIds" },
      // do join on another collection called users, and
      // get the user where _id is equal to the userIds
      {
        $lookup: {
          from: "users",
          localField: "chatRoomInfo.userIds",
          foreignField: "_id",
          as: "chatRoomInfo.userProfile",
        },
      },
      { $unwind: "$chatRoomInfo.userProfile" },
      // group the data by _id
      {
        $group: {
          _id: "$_id",
          chatRoomId: { $last: "$chatRoomInfo._id" },
          message: { $last: "$message" },
          type: { $last: "$type" },
          postedByUser: {
            $last: {
              _id: "$postedByUser._id",
              firstName: "$postedByUser.firstName",
              lastName: "$postedByUser.lastName",
              type: "$postedByUser.type",
            },
          },
          readByRecipients: { $last: "$readByRecipients" },
          chatRoomInfo: {
            $addToSet: {
              _id: "$chatRoomInfo.userProfile._id",
              firstName: "$chatRoomInfo.userProfile.firstName",
              lastName: "$chatRoomInfo.userProfile.lastName",
              type: "$chatRoomInfo.userProfile.type",
            },
          },
          createdAt: { $last: "$createdAt" },
          updatedAt: { $last: "$updatedAt" },
        },
      },
    ]);

    global.io.to(roomId).emit("newMessage", postData[0]);

    return res.status(200).json(postData[0]);
  } catch (error) {
    return res.status(500).json({ error });
  }
};

const getRecentConversation: RequestHandler = (_, __) => {};

const getConversationRoom: RequestHandler = async (req, res) => {
  const { roomId } = req.params;

  try {
    const isRoomAvailable = await ChatRoom.findOne({ _id: roomId });

    if (!isRoomAvailable) {
      return res.status(404).json({ message: "Chat room not found" });
    }

    const users = await User.find({ _id: { $in: isRoomAvailable.userIds } }).select("firstName lastName type");
    const options = {
      page: req.query.page ? +req.query.page : 0,
      limit: req.query.limit ? +req.query.limit : 10,
    };

    const conversation = await ChatMessage.find({ chatRoom: roomId })
      .populate("postedByUser", "firstName lastName type")
      .sort({ createdAt: -1 })
      .skip(options.page * options.limit)
      .limit(options.limit);

    return res.status(200).json({ users, conversation });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

const markConversationReadByRoomId: RequestHandler = (_, __) => {};

export default { initiate, postMessage, getRecentConversation, getConversationRoom, markConversationReadByRoomId };
