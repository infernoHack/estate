import { Server } from "socket.io";
import "dotenv/config";

import { ClientToServerEvents, ServerToClientEvents } from "./socketIO.types";

const io = new Server<ClientToServerEvents, ServerToClientEvents>({
  cors: {
    origin: process.env.CLIENT_URL,
  },
});

const onlineUsers = new Map<string, string>();

const addUser = (userId: string, socketId: string) => {
  !onlineUsers.has(userId) && onlineUsers.set(userId, socketId);
};

const getUserSocketId = (userId: string) => {
  return onlineUsers.get(userId);
};

const removeUser = (socketId: string) => {
  for (const [userId, sktId] of onlineUsers) {
    if (sktId == socketId) {
      onlineUsers.delete(userId);
      break;
    }
  }
};

io.on("connection", (socket) => {
  socket.on("newUser", (userId: string) => {
    addUser(userId, socket.id);
  });

  socket.on(
    "sendMessage",
    (
      receiverId: string,
      messageData: {
        id: string;
        text: string;
        userId: string;
        chatId: string;
        createdAt: string;
      }
    ) => {
      const receiverSocketId = getUserSocketId(receiverId);

      if (receiverSocketId) {
        io.to(receiverSocketId).emit("getMessage", messageData);
      }
    }
  );

  socket.on("disconnect", (socketId: string) => {
    removeUser(socketId);
  });
});

io.listen(4000);
