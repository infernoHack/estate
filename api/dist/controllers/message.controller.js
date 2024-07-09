"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addMessage = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const utils_1 = require("../utils");
exports.addMessage = (0, utils_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { text } = req.body;
    const { id: chatId } = req.params;
    const chat = yield prisma_1.default.chat.findUnique({
        where: {
            id: chatId,
            userIds: {
                hasSome: [req.user],
            },
        },
    });
    if (!chat) {
        return res.status(404).send("Chat not found");
    }
    const newMessage = yield prisma_1.default.message.create({
        data: {
            userId: req.user,
            text,
            chatId,
        },
    });
    yield prisma_1.default.chat.update({
        where: {
            id: chatId,
        },
        data: {
            seenBy: {
                set: [req.user],
            },
            lastMessage: text,
        },
    });
    res.status(200).send(newMessage);
}));
