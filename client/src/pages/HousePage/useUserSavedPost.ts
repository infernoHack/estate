import { useMutation } from "@tanstack/react-query";
import { Dispatch, ThunkDispatch, UnknownAction } from "@reduxjs/toolkit";
import { PersistPartial } from "redux-persist/es/persistReducer";
import toast from "react-hot-toast";

import { useAppDispatch } from "../../redux/store";
import axiosInstance from "../../lib/axiosInstance";
import { updateSavedPost, UserState } from "../../redux/userSlice";

async function updateUserSavedPost(
  id: string,
  dispatch: ThunkDispatch<
    {
      user: UserState;
    } & PersistPartial,
    undefined,
    UnknownAction
  > &
    Dispatch<UnknownAction>,
) {
  const res = await axiosInstance.patch("/users" + "/" + id + "/savedpost", {
    id,
  });
  dispatch(updateSavedPost(res.data));
  toast.success(res.data.message);
}

export function useUserSavedPost() {
  const dispatch = useAppDispatch();

  const { mutate, isPending, error } = useMutation({
    mutationFn: (id: string) => updateUserSavedPost(id, dispatch),
  });

  return { mutate, isPending, error };
}
