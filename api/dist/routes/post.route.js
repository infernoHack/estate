"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const post_controller_1 = require("../controllers/post.controller");
const auth_1 = require("../middlewares/auth");
const router = express_1.default.Router();
router.get("/", post_controller_1.getPosts);
router.get("/:id", post_controller_1.getPost);
router.post("/", auth_1.verifyToken, post_controller_1.addPost);
router.patch("/:id", auth_1.verifyToken, post_controller_1.updatePost);
router.delete("/:id", auth_1.verifyToken, post_controller_1.deletePost);
exports.default = router;
