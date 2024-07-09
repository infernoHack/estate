import { useMutation } from "@tanstack/react-query";

import axiosInstance from "../../lib/axiosInstance";
import { FinalDataType } from "./finalData.types";
import { NavigateFunction, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

async function createPost(
  finalData: FinalDataType,
  navigate: NavigateFunction,
) {
  await axiosInstance.post("/posts", finalData);
  toast.success("Post created successfully");
  navigate("/profile");
}

export function useCreatePost() {
  const navigate = useNavigate();

  const { mutate, isPending, error } = useMutation({
    mutationKey: ["posts"],
    mutationFn: (finalData: FinalDataType) => createPost(finalData, navigate),
  });

  return { mutate, isPending, error };
}
