export interface ServerToClientEvents {
  getMessage: (messageData: {
    id: string;
    text: string;
    userId: string;
    chatId: string;
    createdAt: string;
  }) => void;
}

export interface ClientToServerEvents {
  newUser: (userId: string) => void;
  sendMessage: (
    receiverId: string,
    messageData: {
      id: string;
      text: string;
      userId: string;
      chatId: string;
      createdAt: string;
    }
  ) => void;
}
