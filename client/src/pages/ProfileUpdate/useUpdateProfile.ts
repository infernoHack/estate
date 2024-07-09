import { useMutation } from "@tanstack/react-query";
import { Dispatch, ThunkDispatch, UnknownAction } from "@reduxjs/toolkit";
import { PersistPartial } from "redux-persist/es/persistReducer";
import { NavigateFunction, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { updateStart, updateUser, UserState } from "../../redux/userSlice";
import axiosInstance from "../../lib/axiosInstance";
import { useAppDispatch } from "../../redux/store";
import { AvatarType, FinalDataType, UserType } from "./data.types";

async function updateUserProfile(
  dispatch: ThunkDispatch<
    {
      user: UserState;
    } & PersistPartial,
    undefined,
    UnknownAction
  > &
    Dispatch<UnknownAction>,
  user: UserType,
  finalData: FinalDataType,
  avatar: AvatarType,
  navigate: NavigateFunction,
) {
  dispatch(updateStart());
  const res = await axiosInstance.patch(`/users/${user?.id}`, {
    ...finalData,
    avatar: avatar[0],
  });
  dispatch(updateUser(res.data));
  toast.success("Account updated successfully");
  navigate("/profile");
}

export function useUpdateProfile(user: UserType, avatar: AvatarType) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { mutate, isPending, error } = useMutation({
    mutationKey: ["user"],
    mutationFn: (finalData: FinalDataType) =>
      updateUserProfile(dispatch, user, finalData, avatar, navigate),
  });

  return { mutate, isPending, error };
}
