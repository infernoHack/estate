import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

import axiosInstance from "../../lib/axiosInstance";
import { useSocket } from "../../context/useSocket";
import { Socket } from "socket.io-client";
import {
  ClientToServerEvents,
  ServerToClientEvents,
} from "../../context/socketIO.types";

async function sendMessage({
  chatId,
  text,
  receiverId,
  socket,
}: {
  chatId: string;
  text: string;
  receiverId: string;
  socket: Socket<ServerToClientEvents, ClientToServerEvents> | null;
}) {
  const res = await axiosInstance.post("/messages" + "/" + chatId, { text });
  toast.success("Message sent successfully");
  socket?.emit("sendMessage", receiverId, res.data);
  return res.data;
}

export function useSendMessage() {
  const { socket } = useSocket();

  const { mutate, data, isPending, error } = useMutation({
    mutationFn: ({
      chatId,
      text,
      receiverId,
    }: {
      chatId: string;
      text: string;
      receiverId: string;
    }) => sendMessage({ chatId, text, receiverId, socket }),
  });

  return { mutate, data, isPending, error };
}
