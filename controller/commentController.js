import * as CommentModel from "../models/commentModel.js";

export const createComment = async (req, res) => {
  try {
    const { postId, content, author } = req.body;
    const newComment = await CommentModel.createComment(
      postId,
      content,
      author
    );
    res.status(201).json(newComment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getCommentsByPostId = async (req, res) => {
  try {
    const comments = await CommentModel.getCommentsByPostId(req.params.postId);
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateComment = async (req, res) => {
  try {
    const { content } = req.body;
    const updatedComment = await CommentModel.updateComment(
      req.params.id,
      content
    );
    if (updatedComment) {
      res.status(200).json(updatedComment);
    } else {
      res.status(404).json({ message: "Comment not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const deletedComment = await CommentModel.deleteComment(req.params.id);
    if (deletedComment) {
      res.status(200).json({ message: "Comment deleted successfully" });
    } else {
      res.status(404).json({ message: "Comment not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
