import express from "express";

import { authorizeUser, verifyToken } from "../middlewares/auth";
import {
  deleteUser,
  getUser,
  getUsers,
  updateUser,
  updateUserSavedPosts,
} from "../controllers/user.controller";

const router = express.Router();

router.get("/", verifyToken, getUsers);

router.get("/:id", verifyToken, authorizeUser, getUser);

router.patch("/:id/savedpost", verifyToken, updateUserSavedPosts);

router.patch("/:id", verifyToken, authorizeUser, updateUser);

router.delete("/:id", verifyToken, authorizeUser, deleteUser);

export default router;
