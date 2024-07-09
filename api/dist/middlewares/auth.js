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
exports.authorizeChatParticipant = exports.authorizePostOwner = exports.authorizeUser = exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const utils_1 = require("../utils");
const AppError_1 = __importDefault(require("../AppError"));
const prisma_1 = __importDefault(require("../lib/prisma"));
exports.verifyToken = (0, utils_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { authorization } = req.cookies;
    if (!authorization) {
        throw new AppError_1.default(401, "Not authenticated");
    }
    jsonwebtoken_1.default.verify(authorization, process.env.JWT_SECRET, function (err, decoded) {
        return __awaiter(this, void 0, void 0, function* () {
            if (err) {
                throw new AppError_1.default(403, "Token is not valid");
            }
            if (typeof decoded !== "string" && (decoded === null || decoded === void 0 ? void 0 : decoded.id)) {
                req.user = decoded.id;
            }
            else {
                throw new AppError_1.default(403, "Token format is incorrect");
            }
            next();
        });
    });
}));
exports.authorizeUser = (0, utils_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (req.user !== id) {
        throw new AppError_1.default(401, "Not authorized");
    }
    next();
}));
exports.authorizePostOwner = (0, utils_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const userId = req.user;
    const post = yield prisma_1.default.post.findUnique({
        where: {
            id,
        },
        select: {
            userId: true,
        },
    });
    if (userId !== (post === null || post === void 0 ? void 0 : post.userId)) {
        throw new AppError_1.default(403, "You aren't authorized to update this.");
    }
    next();
}));
exports.authorizeChatParticipant = (0, utils_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const userId = req.user;
    const chat = yield prisma_1.default.chat.findUnique({
        where: {
            id,
        },
        select: {
            userIds: true,
        },
    });
    if ((chat === null || chat === void 0 ? void 0 : chat.userIds.includes(userId)) === false) {
        throw new AppError_1.default(403, "You aren't authorized to read this.");
    }
    next();
}));
