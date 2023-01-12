import { RequestHandler } from "express";

const initiate: RequestHandler = (_, __) => {};

const postMessage: RequestHandler = (_, __) => {};

const getRecentConversation: RequestHandler = (_, __) => {};

const getConversationRoom: RequestHandler = (_, __) => {};

const markConversationReadByRoomId: RequestHandler = (_, __) => {};

export { initiate, postMessage, getRecentConversation, getConversationRoom, markConversationReadByRoomId };
