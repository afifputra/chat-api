import { Socket } from "socket.io";

interface User {
  userId: string;
  socketId: string;
}

class WebSockets {
  users: User[] = [];

  constructor() {
    this.users = [];
  }

  connection = (client: Socket) => {
    console.log("Client connected");
    // event fired when the chat room is disconnected
    client.on("disconnect", () => {
      this.users = this.users.filter((user) => user.socketId !== client.id);
      console.log("Client disconnected");
    });

    // add identity of user mapped to socket id
    client.on("identity", (userId: string) => {
      console.log(`Client Identity: ${userId}`);
      this.users.push({ userId, socketId: client.id });
    });

    // subscribe person to chat & other users as well
    client.on("subscribe", (room: string, otherUserId: string) => {
      this.subcribeOtherUser(room, otherUserId);
      client.join(room);
      console.log("joining room", room);
    });

    // mute a chat room
    client.on("unsubscribe", (room: string) => {
      client.leave(room);
      console.log("leaving room", room);
    });
  };

  subcribeOtherUser = (room: string, otherUserId: string) => {
    const userSockets = this.users.filter((user) => user.userId === otherUserId);
    console.log("userSockets", userSockets);
    userSockets.map((userInfo) => {
      // get socket id
      const socketConn = global.io.sockets.connected(userInfo.socketId);
      if (socketConn) {
        socketConn.join(room);
      }
    });
  };
}

export default new WebSockets();
