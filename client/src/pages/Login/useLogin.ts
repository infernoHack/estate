import { useMutation } from "@tanstack/react-query";
import { Dispatch, ThunkDispatch, UnknownAction } from "@reduxjs/toolkit";
import { PersistPartial } from "redux-persist/es/persistReducer";
import { NavigateFunction, useNavigate } from "react-router-dom";

import { useAppDispatch } from "../../redux/store";
import { loginComplete, loginStart, UserState } from "../../redux/userSlice";
import axiosInstance from "../../lib/axiosInstance";
import { DataType } from "./data.types";
import toast from "react-hot-toast";

async function login(
  dispatch: ThunkDispatch<
    {
      user: UserState;
    } & PersistPartial,
    undefined,
    UnknownAction
  > &
    Dispatch<UnknownAction>,
  data: DataType,
  navigate: NavigateFunction,
) {
  dispatch(loginStart());
  const res = await axiosInstance.post("/auth/login", { ...data });
  dispatch(loginComplete(res.data));
  toast.success("Welcome to Elite Estate");
  navigate("/");
}

export function useLogin() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { mutate, isPending, error } = useMutation({
    mutationKey: ["user"],
    mutationFn: (data: DataType) => login(dispatch, data, navigate),
  });

  return { mutate, isPending, error };
}
