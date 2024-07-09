"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middlewares/auth");
const user_controller_1 = require("../controllers/user.controller");
const router = express_1.default.Router();
router.get("/", auth_1.verifyToken, user_controller_1.getUsers);
router.get("/:id", auth_1.verifyToken, auth_1.authorizeUser, user_controller_1.getUser);
router.patch("/:id/savedpost", auth_1.verifyToken, user_controller_1.updateUserSavedPosts);
router.patch("/:id", auth_1.verifyToken, auth_1.authorizeUser, user_controller_1.updateUser);
router.delete("/:id", auth_1.verifyToken, auth_1.authorizeUser, user_controller_1.deleteUser);
exports.default = router;
