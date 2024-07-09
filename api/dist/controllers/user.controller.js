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
exports.deleteUser = exports.updateUserSavedPosts = exports.updateUser = exports.getUser = exports.getUsers = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma_1 = __importDefault(require("../lib/prisma"));
const utils_1 = require("../utils");
const cloudinary_1 = __importDefault(require("../cloudinary"));
exports.getUsers = (0, utils_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield prisma_1.default.user.findMany({ include: { avatar: true } });
    const usersWithoutPassword = users.map((user) => {
        var _a, _b, _c, _d;
        return {
            id: user.id,
            username: user.username,
            fullname: user.fullname,
            email: user.email,
            avatar: {
                id: (_a = user.avatar) === null || _a === void 0 ? void 0 : _a.id,
                filename: (_b = user.avatar) === null || _b === void 0 ? void 0 : _b.filename,
                url: (_c = user.avatar) === null || _c === void 0 ? void 0 : _c.url,
                public_id: (_d = user.avatar) === null || _d === void 0 ? void 0 : _d.public_id,
            },
        };
    });
    res.status(200).send(usersWithoutPassword);
}));
exports.getUser = (0, utils_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const user = yield prisma_1.default.user.findUnique({
        where: {
            id,
        },
        select: {
            id: true,
            username: true,
            fullname: true,
            email: true,
            avatar: {
                select: {
                    id: true,
                    filename: true,
                    url: true,
                    public_id: true,
                },
            },
            posts: {
                select: {
                    id: true,
                    title: true,
                    price: true,
                    latitude: true,
                    longitude: true,
                    address: true,
                    transaction: true,
                    property: true,
                    images: true,
                    features: {
                        select: {
                            sizes: true,
                        },
                    },
                },
            },
            savedPosts: {
                select: {
                    id: true,
                    title: true,
                    price: true,
                    latitude: true,
                    longitude: true,
                    address: true,
                    transaction: true,
                    property: true,
                    images: true,
                    features: {
                        select: {
                            sizes: true,
                        },
                    },
                },
            },
        },
    });
    if (!user) {
        return res.status(200).send("User not found");
    }
    res.status(200).send(user);
}));
exports.updateUser = (0, utils_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id } = req.params;
    const { fullname, email, password, avatar } = req.body;
    let newPassword = null;
    if (password) {
        newPassword = yield bcrypt_1.default.hash(password, 12);
    }
    if (avatar) {
        // Delete the previous one from cloudinary by first finding the avatar and then deleting it.
        const user = yield prisma_1.default.user.findUnique({
            where: {
                id,
            },
            include: {
                avatar: true,
            },
        });
        if ((_a = user === null || user === void 0 ? void 0 : user.avatar) === null || _a === void 0 ? void 0 : _a.filename) {
            cloudinary_1.default.uploader
                .destroy(user.avatar.public_id, { invalidate: true })
                .then((result) => console.log(result));
        }
    }
    const user = yield prisma_1.default.user.update({
        where: {
            id,
        },
        data: Object.assign(Object.assign({ fullname,
            email }, (newPassword && { password: newPassword })), (avatar && {
            avatar: {
                update: avatar,
            },
        })),
        select: {
            id: true,
            username: true,
            fullname: true,
            email: true,
            avatar: {
                select: {
                    id: true,
                    filename: true,
                    url: true,
                    public_id: true,
                },
            },
        },
    });
    res.status(200).send(user);
}));
exports.updateUserSavedPosts = (0, utils_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.body;
    const foundUser = yield prisma_1.default.user.findUnique({
        where: {
            id: req.user,
        },
        select: {
            savedPosts: {
                select: {
                    id: true,
                },
            },
        },
    });
    if (foundUser.savedPosts.some((item) => item.id === id)) {
        const updatedUser = yield prisma_1.default.user.update({
            where: {
                id: req.user,
            },
            data: {
                savedPosts: {
                    deleteMany: {
                        where: {
                            id,
                        },
                    },
                },
            },
            select: {
                savedPosts: {
                    select: {
                        id: true,
                        title: true,
                    },
                },
            },
        });
        return res
            .status(200)
            .send(Object.assign(Object.assign({}, updatedUser), { message: "Post deleted successfully" }));
    }
    else {
        const post = yield prisma_1.default.post.findUnique({
            where: {
                id,
            },
        });
        if (!post) {
            return res.status(404).send("Post not found");
        }
        const updatedUser = yield prisma_1.default.user.update({
            where: {
                id: req.user,
            },
            data: {
                savedPosts: {
                    push: [
                        {
                            id: post === null || post === void 0 ? void 0 : post.id,
                            title: post === null || post === void 0 ? void 0 : post.title,
                            images: post.images,
                            price: post === null || post === void 0 ? void 0 : post.price,
                            latitude: post === null || post === void 0 ? void 0 : post.latitude,
                            longitude: post === null || post === void 0 ? void 0 : post.longitude,
                            address: post === null || post === void 0 ? void 0 : post.address,
                            transaction: post === null || post === void 0 ? void 0 : post.transaction,
                            property: post === null || post === void 0 ? void 0 : post.property,
                            features: post === null || post === void 0 ? void 0 : post.features,
                        },
                    ],
                },
            },
            select: {
                savedPosts: {
                    select: {
                        id: true,
                        title: true,
                    },
                },
            },
        });
        return res
            .status(200)
            .send(Object.assign(Object.assign({}, updatedUser), { message: "Post saved successfully" }));
    }
}));
exports.deleteUser = (0, utils_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    yield prisma_1.default.user.delete({
        where: {
            id,
        },
    });
    res.status(200).send("User deleted successfully");
}));
