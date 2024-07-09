"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const chat_controller_1 = require("../controllers/chat.controller");
const auth_1 = require("../middlewares/auth");
const router = express_1.default.Router();
router.get("/", auth_1.verifyToken, chat_controller_1.getChats);
router.get("/:id", auth_1.verifyToken, auth_1.authorizeChatParticipant, chat_controller_1.getChat);
router.post("/", auth_1.verifyToken, chat_controller_1.addChat);
router.patch("/:id", auth_1.verifyToken, auth_1.authorizeChatParticipant, chat_controller_1.readChat);
exports.default = router;
