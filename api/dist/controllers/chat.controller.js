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
exports.readChat = exports.addChat = exports.getChat = exports.getChats = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const utils_1 = require("../utils");
exports.getChats = (0, utils_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const chats = yield prisma_1.default.chat.findMany({
        where: {
            userIds: {
                hasSome: [req.user],
            },
        },
    });
    const modifiedChats = yield Promise.all(chats.map((chat) => __awaiter(void 0, void 0, void 0, function* () {
        const receiverId = chat.userIds.find((id) => id !== req.user);
        const receiver = yield prisma_1.default.user.findUnique({
            where: {
                id: receiverId,
            },
            select: {
                id: true,
                username: true,
                avatar: {
                    select: {
                        url: true,
                    },
                },
            },
        });
        return Object.assign(Object.assign({}, chat), { receiver });
    })));
    res.status(200).send(modifiedChats);
}));
exports.getChat = (0, utils_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const chat = yield prisma_1.default.chat.findUnique({
        where: {
            id,
            userIds: {
                hasSome: [req.user],
            },
        },
        select: {
            id: true,
            userIds: true,
            seenBy: true,
            messages: {
                orderBy: {
                    createdAt: "asc",
                },
            },
            createdAt: true,
        },
    });
    const receiverId = chat.userIds.find((id) => id !== req.user);
    const receiver = yield prisma_1.default.user.findUnique({
        where: {
            id: receiverId,
        },
        select: {
            id: true,
            username: true,
            fullname: true,
            avatar: {
                select: {
                    url: true,
                },
            },
        },
    });
    if ((chat === null || chat === void 0 ? void 0 : chat.seenBy.includes(req.user)) === true) {
        return res.status(200).send(Object.assign(Object.assign({}, chat), { receiver }));
    }
    // Return updated chat
    const updatedChat = yield prisma_1.default.chat.update({
        where: {
            id,
        },
        data: {
            seenBy: {
                push: req.user,
            },
        },
        include: {
            messages: {
                orderBy: {
                    createdAt: "asc",
                },
            },
        },
    });
    res.status(200).send(Object.assign(Object.assign({}, updatedChat), { receiver }));
}));
exports.addChat = (0, utils_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { receiverId } = req.body;
    const newChat = yield prisma_1.default.chat.create({
        data: {
            userIds: [req.user, receiverId],
        },
    });
    res.status(200).send(newChat);
}));
exports.readChat = (0, utils_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const chat = yield prisma_1.default.chat.findUnique({
        where: {
            id,
            userIds: {
                hasSome: [req.user],
            },
        },
    });
    if (chat === null || chat === void 0 ? void 0 : chat.seenBy.includes(req.user)) {
        return res.status(200).send(chat);
    }
    const updatedChat = yield prisma_1.default.chat.update({
        where: {
            id,
            userIds: {
                hasSome: [req.user],
            },
        },
        data: {
            seenBy: {
                push: req.user,
            },
        },
    });
    res.status(200).send(updatedChat);
}));
