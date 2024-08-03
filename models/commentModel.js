import {pool} from "../db.js";

export const createComment = async (postId, content, author) => {
  const query =
    "INSERT INTO comments (post_id, content, author) VALUES ($1, $2, $3) RETURNING *";
  const values = [postId, content, author];
  const result = await pool.query(query, values);
  return result.rows[0];
};

export const getCommentsByPostId = async (postId) => {
  const query =
    "SELECT * FROM comments WHERE post_id = $1 ORDER BY created_at ASC";
  const values = [postId];
  const result = await pool.query(query, values);
  return result.rows;
};

export const updateComment = async (id, content) => {
  const query =
    "UPDATE comments SET content = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *";
  const values = [content, id];
  const result = await pool.query(query, values);
  return result.rows[0];
};

export const deleteComment = async (id) => {
  const query = "DELETE FROM comments WHERE id = $1 RETURNING *";
  const values = [id];
  const result = await pool.query(query, values);
  return result.rows[0];
};
