import express from "express";
import * as PostController from "../controller/postController.js";

const postRoutes = express.Router();

postRoutes.post("/", PostController.createPost);
postRoutes.get("/", PostController.getAllPosts);
postRoutes.get("/:id", PostController.getPostById);
postRoutes.put("/:id", PostController.updatePost);
postRoutes.delete("/:id", PostController.deletePost);

export default postRoutes;
