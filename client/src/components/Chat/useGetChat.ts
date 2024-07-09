import { useMutation } from "@tanstack/react-query";

import axiosInstance from "../../lib/axiosInstance";
import { ChatDataType } from "./data.types";

async function getChat(id: string): Promise<ChatDataType> {
  const res = await axiosInstance.get("/chats" + "/" + id);
  return res.data;
}

export function useGetChat() {
  const { data, mutate, isPending, error } = useMutation({
    mutationKey: [`chat`],
    mutationFn: getChat,
  });

  return { data, mutate, isPending, error };
}
