import { useQuery } from "@tanstack/react-query";

import axiosInstance from "../../lib/axiosInstance";
import { UserType } from "./user.types";

async function getUser(id: string): Promise<UserType> {
  const res = await axiosInstance.get("/users" + "/" + id);
  return res.data;
}

export function useUser(id: string) {
  const { data, isPending, error } = useQuery({
    queryKey: ["user"],
    queryFn: () => getUser(id),
  });

  return { data, isPending, error };
}
