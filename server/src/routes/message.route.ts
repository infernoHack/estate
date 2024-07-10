import express from "express";

import { addMessage } from "../controllers/message.controller";
import { authorizeChatParticipant, verifyToken } from "../middlewares/auth";

const router = express.Router();

router.post("/:id", verifyToken, authorizeChatParticipant, addMessage);

export default router;
