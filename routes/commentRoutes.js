import express from "express";
import * as CommentController from "../controller/commentController.js";

const commentRoutes = express.Router();

commentRoutes.post("/", CommentController.createComment);
commentRoutes.get("/post/:postId", CommentController.getCommentsByPostId);
commentRoutes.put("/:id", CommentController.updateComment);
commentRoutes.delete("/:id", CommentController.deleteComment);

export default commentRoutes;
