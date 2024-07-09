import { useMutation } from "@tanstack/react-query";
import { Dispatch, ThunkDispatch, UnknownAction } from "@reduxjs/toolkit";
import { PersistPartial } from "redux-persist/es/persistReducer";
import { NavigateFunction, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { useAppDispatch } from "../../redux/store";
import { loginComplete, loginStart, UserState } from "../../redux/userSlice";
import axiosInstance from "../../lib/axiosInstance";
import { AvatarType, DataType } from "./data.types";

async function register(
  dispatch: ThunkDispatch<
    {
      user: UserState;
    } & PersistPartial,
    undefined,
    UnknownAction
  > &
    Dispatch<UnknownAction>,
  data: DataType,
  avatar: AvatarType,
  navigate: NavigateFunction,
) {
  dispatch(loginStart());
  const res = await axiosInstance.post("/auth/register", {
    ...data,
    avatar: avatar[0],
  });
  dispatch(loginComplete(res.data));
  toast.success("Account registered successfully");
  navigate("/");
}

export function useRegister() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { mutate, isPending, error } = useMutation({
    mutationKey: ["user"],
    mutationFn: ({ data, avatar }: { data: DataType; avatar: AvatarType }) =>
      register(dispatch, data, avatar, navigate),
  });

  return { mutate, isPending, error };
}
