import express from "express";

import {
  addPost,
  deletePost,
  getPost,
  getPosts,
  updatePost,
} from "../controllers/post.controller";
import { verifyToken } from "../middlewares/auth";

const router = express.Router();

router.get("/", getPosts);

router.get("/:id", getPost);

router.post("/", verifyToken, addPost);

router.patch("/:id", verifyToken, updatePost);

router.delete("/:id", verifyToken, deletePost);

export default router;
