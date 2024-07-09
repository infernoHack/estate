import { useQuery } from "@tanstack/react-query";

import axiosInstance from "../../lib/axiosInstance";
import { HouseListPageType } from "./houseListPage.types";

async function getAllPosts(queryString: string): Promise<HouseListPageType> {
  const res = await axiosInstance.get("/posts" + queryString);

  return res.data;
}

export function useHouseListPage(queryString: string) {
  const { data, isPending, error } = useQuery({
    queryKey: ["posts", queryString],
    queryFn: () => getAllPosts(queryString),
  });

  return { data, isPending, error };
}
