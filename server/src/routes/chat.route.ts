import express from "express";

import {
  addChat,
  getChat,
  getChats,
  readChat,
} from "../controllers/chat.controller";
import { authorizeChatParticipant, verifyToken } from "../middlewares/auth";

const router = express.Router();

router.get("/", verifyToken, getChats);

router.get("/:id", verifyToken, authorizeChatParticipant, getChat);

router.post("/", verifyToken, addChat);

router.patch("/:id", verifyToken, authorizeChatParticipant, readChat);

export default router;
