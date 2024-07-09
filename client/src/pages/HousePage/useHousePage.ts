import { useQuery } from "@tanstack/react-query";

import axiosInstance from "../../lib/axiosInstance";
import { HousePageType } from "./housePage.types";

async function getPost(id: string): Promise<HousePageType> {
  const res = await axiosInstance.get("/posts" + "/" + id);
  return res.data;
}

export function useHousePage(id: string) {
  const { data, isPending, error } = useQuery({
    queryKey: [`/post/${id}`],
    queryFn: () => getPost(id),
  });

  return { data, isPending, error };
}
