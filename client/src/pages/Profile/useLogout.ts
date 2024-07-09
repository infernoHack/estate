import { useMutation } from "@tanstack/react-query";
import { Dispatch, ThunkDispatch, UnknownAction } from "@reduxjs/toolkit";
import { PersistPartial } from "redux-persist/es/persistReducer";
import { NavigateFunction, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { persistor, useAppDispatch } from "../../redux/store";
import axiosInstance from "../../lib/axiosInstance";
import { logout, UserState } from "../../redux/userSlice";

async function login(
  dispatch: ThunkDispatch<
    {
      user: UserState;
    } & PersistPartial,
    undefined,
    UnknownAction
  > &
    Dispatch<UnknownAction>,
  navigate: NavigateFunction,
) {
  await axiosInstance.post("/auth/logout");
  dispatch(logout());
  persistor.purge();
  toast.success("Logged out successfully");
  navigate("/");
}

export function useLogout() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { mutate, isPending, error } = useMutation({
    mutationKey: ["user"],
    mutationFn: () => login(dispatch, navigate),
  });

  return { mutate, isPending, error };
}
