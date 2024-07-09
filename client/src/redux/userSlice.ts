import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { PURGE } from "redux-persist";

export interface UserState {
  currentUser: {
    id: string;
    username: string;
    fullname: string;
    email: string;
    avatar?: {
      id: string;
      url: string;
      filename: string;
      public_id: string;
    };
    savedPosts: { id: string; title: string }[];
  } | null;
  isFetching: boolean;
  error: string;
}

const initialState: UserState = {
  currentUser: null,
  isFetching: true,
  error: "",
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.isFetching = true;
    },
    loginComplete: (
      state,
      action: PayloadAction<{
        id: string;
        username: string;
        fullname: string;
        email: string;
        avatar?: {
          id: string;
          url: string;
          filename: string;
          public_id: string;
        };
        savedPosts: {
          id: string;
          title: string;
          price: number;
          images: [];
          latitude: number;
          longitude: number;
          address: string;
          transaction: string;
          property: string;
          features: object;
        }[];
      }>,
    ) => {
      const newPayload = {
        ...action.payload,
        savedPosts: action.payload.savedPosts.map((item) => ({
          id: item.id,
          title: item.title,
        })),
      };
      state.isFetching = false;
      state.currentUser = newPayload;
    },
    logout: (state) => {
      state.isFetching = false;
      state.currentUser = null;
    },
    updateStart: (state) => {
      state.isFetching = true;
    },
    updateUser: (
      state,
      action: PayloadAction<{
        id: string;
        username: string;
        fullname: string;
        email: string;
        avatar?: {
          id: string;
          url: string;
          filename: string;
          public_id: string;
        };
      }>,
    ) => {
      state.isFetching = false;
      state.currentUser = {
        ...action.payload,
        savedPosts: state.currentUser?.savedPosts || [],
      };
    },
    updateSavedPost: (
      state,
      action: PayloadAction<{
        savedPosts: {
          id: string;
          title: string;
          price: number;
          images: [];
          latitude: number;
          longitude: number;
          address: string;
          transaction: string;
          property: string;
          features: object;
        }[];
      }>,
    ) => {
      const newPayload = action.payload.savedPosts.map((item) => ({
        id: item.id,
        title: item.title,
      }));
      state.isFetching = false;
      state.currentUser = { ...state.currentUser!, savedPosts: newPayload };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(PURGE, () => {
      return initialState;
    });
  },
});

export const {
  loginStart,
  loginComplete,
  logout,
  updateStart,
  updateUser,
  updateSavedPost,
} = userSlice.actions;

export default userSlice;
