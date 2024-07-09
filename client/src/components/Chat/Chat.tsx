import {
  FormEvent,
  KeyboardEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { BsSend } from "react-icons/bs";
import { formatDistance } from "date-fns";

import { useGetChats } from "./useGetChats";
import { useGetChat } from "./useGetChat";
import { useAppSelector } from "../../redux/store";
import { useSendMessage } from "./useSendMessage";
import { useSocket } from "../../context/useSocket";
import { ChatDataType } from "./data.types";

function Chat() {
  const user = useAppSelector((state) => state.user).currentUser;
  const { socket } = useSocket();

  const [selectedChat, setSelectedChat] = useState<ChatDataType | null>(null);
  const messageEndRef = useRef<HTMLDivElement>(null);

  const { data: chatsData, isPending: isLoadingChats } = useGetChats();
  const { data: chatData, mutate: getChatMutuate } = useGetChat();
  const {
    data: messageData,
    mutate: sendMessageMutate,
    isPending: isSendingMessage,
  } = useSendMessage();

  useEffect(() => {
    if (chatData) setSelectedChat(chatData);
  }, [chatData]);

  useEffect(() => {
    if (selectedChat)
      messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedChat]);

  useEffect(() => {
    if (messageData !== undefined) {
      setSelectedChat((prevChat) => {
        if (!prevChat) return prevChat;
        return { ...prevChat, messages: [...prevChat.messages, messageData] };
      });
    }
  }, [messageData]);

  useEffect(() => {
    const handleMessage = (messageData: {
      id: string;
      text: string;
      userId: string;
      chatId: string;
      createdAt: string;
    }) => {
      setSelectedChat((prevChat) => {
        if (!prevChat) return prevChat;
        return { ...prevChat, messages: [...prevChat.messages, messageData] };
      });
    };

    socket?.on("getMessage", handleMessage);

    return () => {
      socket?.off("getMessage", handleMessage);
    };
  }, [socket]);

  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget as HTMLFormElement);
      const message = formData.get("message") as string;
      if (message && selectedChat) {
        sendMessageMutate({
          chatId: selectedChat.id,
          text: message,
          receiverId: selectedChat.receiver!.id,
        });
        e.currentTarget.reset();
      }
    },
    [selectedChat, sendMessageMutate],
  );

  const handleKeyboardSubmit = useCallback(
    (e: KeyboardEvent<HTMLFormElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSubmit(e);
      }
    },
    [handleSubmit],
  );

  const handleChatClick = useCallback(
    (chatId: string) => {
      selectedChat?.id === chatId
        ? setSelectedChat(null)
        : getChatMutuate(chatId);
    },
    [selectedChat?.id, getChatMutuate],
  );

  if (isLoadingChats || chatsData === undefined) return null;

  return (
    <div className="flex h-full flex-col gap-5 py-2">
      <div
        className={`flex ${selectedChat === null ? "h-full" : "h-2/5"} flex-col gap-5 overflow-auto px-6`}
      >
        <h2 className="text-2xl font-light lg:text-3xl">Messages</h2>
        <div className="flex flex-col gap-y-4">
          {chatsData.map((chat) => (
            <div
              className="p flex items-center gap-4 border bg-orange-50 px-4 py-2 hover:border-orange-400 lg:bg-orange-100"
              onClick={() => handleChatClick(chat.id)}
              key={chat.id}
            >
              <img
                src={chat.receiver?.avatar.url || "noavatar.jpg"}
                className="size-8 rounded-full"
                alt="receiver-avatar"
              />
              <span>{chat.receiver?.username}</span>
              <span className="flex-1 text-sm">
                {chat.lastMessage?.substring(0, 30) + "..." || "No message"}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div
        className={`${selectedChat === null ? "hidden" : "h-3/5"} mx-7 border`}
      >
        <div className="flex items-center gap-2 bg-yellow-300 px-4 py-2 text-yellow-900">
          <img
            src={selectedChat?.receiver?.avatar.url || "noavatar.jpg"}
            className="size-7 rounded-full object-cover"
            alt="receiver-avatar"
          />
          <span className="text-sm">{selectedChat?.receiver?.fullname}</span>
          <button
            className="ml-auto p-2 hover:font-semibold"
            onClick={() => setSelectedChat(null)}
          >
            X
          </button>
        </div>
        <div className="flex h-48 flex-col gap-4 overflow-auto bg-orange-50 px-3 py-2 lg:h-60">
          {selectedChat?.messages.map((message) => (
            <div
              className={`flex max-w-72 flex-col rounded-lg bg-orange-100 p-2 ${message.userId === user?.id && "ml-auto text-right"}`}
              key={message.id}
            >
              <p className="text-sm text-stone-800">{message.text}</p>
              <p className="text-xs">
                {formatDistance(new Date(message.createdAt), Date.now(), {
                  addSuffix: true,
                })}
              </p>
            </div>
          ))}
          <div ref={messageEndRef}></div>
        </div>
        <form
          className="flex"
          onSubmit={handleSubmit}
          onKeyDown={handleKeyboardSubmit}
        >
          <textarea
            name="message"
            className="h-10 w-full overflow-hidden border p-2 placeholder:italic placeholder:text-slate-400 focus:outline-yellow-400"
            placeholder="Write a message..."
            required
          ></textarea>
          <button
            className="flex items-center justify-center bg-yellow-400 px-6 transition-all hover:bg-yellow-500"
            disabled={isSendingMessage}
          >
            <BsSend style={{ color: "white", fontSize: "18px" }} />
          </button>
        </form>
      </div>
    </div>
  );
}

export default Chat;
