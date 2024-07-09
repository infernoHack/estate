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
exports.deletePost = exports.updatePost = exports.addPost = exports.getPost = exports.getPosts = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const utils_1 = require("../utils");
const cloudinary_1 = __importDefault(require("../cloudinary"));
const AppError_1 = __importDefault(require("../AppError"));
exports.getPosts = (0, utils_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { city, transaction, property, bedrooms, minPrice, maxPrice, } = req.query;
    const posts = yield prisma_1.default.post.findMany({
        where: {
            city,
            transaction,
            property,
            features: {
                is: {
                    sizes: {
                        is: {
                            bedrooms: {
                                gte: bedrooms ? parseInt(bedrooms) : undefined,
                            },
                        },
                    },
                },
            },
            price: {
                gte: minPrice ? parseInt(minPrice) : undefined,
                lte: maxPrice ? parseInt(maxPrice) : undefined,
            },
        },
        select: {
            id: true,
            title: true,
            images: true,
            price: true,
            address: true,
            latitude: true,
            longitude: true,
            transaction: true,
            property: true,
            features: true,
            user: {
                select: {
                    id: true,
                    username: true,
                    fullname: true,
                    email: true,
                },
            },
        },
    });
    res.status(200).send(posts);
}));
exports.getPost = (0, utils_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const post = yield prisma_1.default.post.findUnique({
        where: {
            id,
        },
        include: {
            user: {
                select: {
                    id: true,
                    username: true,
                    fullname: true,
                    email: true,
                    avatar: {
                        select: {
                            url: true,
                        },
                    },
                },
            },
        },
    });
    if (!post) {
        throw new AppError_1.default(404, "House not found");
    }
    res.status(200).send(post);
}));
exports.addPost = (0, utils_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, price, city, address, latitude, longitude, description, transaction, property, images, features, } = req.body;
    const userId = req.user;
    const newPost = yield prisma_1.default.post.create({
        data: {
            title,
            price,
            images,
            latitude,
            longitude,
            city,
            address,
            description,
            transaction,
            property,
            features,
            userId,
        },
    });
    res.status(200).send(newPost);
}));
exports.updatePost = (0, utils_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { title, price, images, latitude, longitude, city, address, description, transaction, property, features, } = req.body;
    // Verify the owner
    const post = yield prisma_1.default.post.findUnique({
        where: {
            id,
        },
        select: {
            userId: true,
            images: true,
        },
    });
    if ((post === null || post === void 0 ? void 0 : post.userId) !== req.user) {
        return res.status(403).send("You aren't authorized");
    }
    // if (images) {
    //   // Delete the previous one from cloudinary by first finding the avatar and then deleting it.
    //   if (user?.avatar?.filename) {
    //     cloudinary.uploader
    //       .destroy(user.avatar.public_id, { invalidate: true })
    //       .then((result) => console.log(result));
    //   }
    // }
    const updatedPost = yield prisma_1.default.post.update({
        where: {
            id,
        },
        data: Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, (title && { title })), (price && { price })), (latitude && { latitude })), (longitude && { longitude })), (city && { city })), (address && { address })), (description && { description })), (transaction && { transaction })), (property && { property })), (features && { features })),
    });
    res.status(200).send(updatedPost);
}));
exports.deletePost = (0, utils_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    // Verify the owner
    const post = yield prisma_1.default.post.findUnique({
        where: {
            id,
        },
        select: {
            userId: true,
            images: true,
        },
    });
    if ((post === null || post === void 0 ? void 0 : post.userId) !== req.user) {
        return res.status(403).send("You aren't authorized");
    }
    for (const image of (post === null || post === void 0 ? void 0 : post.images) || []) {
        cloudinary_1.default.uploader
            .destroy(image.public_id, { invalidate: true })
            .then((result) => console.log(result));
    }
    yield prisma_1.default.post.delete({
        where: {
            id,
        },
    });
    res.status(200).send("Post deleted successfully");
}));
