export type ChatsDataType = {
  id: string;
  userIds: string[];
  seenBy: string[];
  lastMessage: string | null;
  createdAt: string;
  receiver: {
    id: string;
    username: string;
    avatar: {
      url: string;
    };
  } | null;
}[];

export type ChatDataType = {
  id: string;
  userIds: string[];
  seenBy: string[];
  createdAt: string;
  receiver: {
    id: string;
    username: string;
    fullname: string;
    avatar: {
      url: string;
    };
  } | null;
  messages: {
    id: string;
    text: string;
    userId: string;
    chatId: string;
    createdAt: string;
  }[];
};
