import { pool } from "../db.js";

export const createPost = async (title, content, author) => {
  const query =
    "INSERT INTO posts (title, content, author) VALUES ($1, $2, $3) RETURNING *";
  const values = [title, content, author];
  const result = await pool.query(query, values);
  return result.rows[0];
};

export const getAllPosts = async () => {
  const query = "SELECT * FROM posts ORDER BY created_at DESC";
  const result = await pool.query(query);
  return result.rows;
};

export const getPostById = async (id) => {
  const query = "SELECT * FROM posts WHERE id = $1";
  const values = [id];
  const result = await pool.query(query, values);
  return result.rows[0];
};

export const updatePost = async (id, title, content) => {
  const query =
    "UPDATE posts SET title = $1, content = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *";
  const values = [title, content, id];
  const result = await pool.query(query, values);
  return result.rows[0];
};

export const deletePost = async (id) => {
  const query = "DELETE FROM posts WHERE id = $1 RETURNING *";
  const values = [id];
  const result = await pool.query(query, values);
  return result.rows[0];
};
