import { useQuery } from "@tanstack/react-query";

import axiosInstance from "../../lib/axiosInstance";
import { ChatsDataType } from "./data.types";

async function getChats(): Promise<ChatsDataType> {
  const res = await axiosInstance.get("/chats");
  return res.data;
}

export function useGetChats() {
  const { data, isPending, error } = useQuery({
    queryKey: ["chats"],
    queryFn: getChats,
  });

  return { data, isPending, error };
}
