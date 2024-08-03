import { pool } from "../db.js";
import bcrypt from "bcrypt";

class User {
  static async create(
    username,
    email,
    password,
    phone = null,
    location = null
  ) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query =
      "INSERT INTO users (username, email, password, phone, location, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) RETURNING id, username, email, phone, location, created_at, updated_at";
    const values = [username, email, hashedPassword, phone, location];

    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      if (error.code === "23505") {
        // unique violation
        if (error.constraint.includes("email")) {
          throw new Error("Email already exists");
        } else if (error.constraint.includes("username")) {
          throw new Error("Username already exists");
        } else {
          throw new Error("Username or email already exists");
        }
      }
      throw error;
    }
  }

  static async update(id, updateFields) {
    const allowedFields = [
      "username",
      "email",
      "password",
      "phone",
      "location",
    ];
    const setClause = [];
    const values = [];
    let paramCount = 1;

    for (const [key, value] of Object.entries(updateFields)) {
      if (allowedFields.includes(key)) {
        setClause.push(`${key} = $${paramCount}`);
        values.push(key === "password" ? await bcrypt.hash(value, 10) : value);
        paramCount++;
      }
    }

    if (setClause.length === 0) {
      throw new Error("No valid fields to update");
    }

    setClause.push(`updated_at = CURRENT_TIMESTAMP`);

    const query = `
      UPDATE users 
      SET ${setClause.join(", ")}
      WHERE id = $${paramCount}
      RETURNING id, username, email, phone, location, created_at, updated_at
    `;
    values.push(id);

    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      if (error.code === "23505") {
        // unique violation
        if (error.constraint.includes("email")) {
          throw new Error("Email already exists");
        } else if (error.constraint.includes("username")) {
          throw new Error("Username already exists");
        } else {
          throw new Error("Username or email already exists");
        }
      }
      throw error;
    }
  }

  static async getById(id) {
    const query =
      "SELECT id, username, email, phone, location, created_at, updated_at FROM users WHERE id = $1";
    try {
      const result = await pool.query(query, [id]);
      return result.rows[0] || null;
    } catch (error) {
      throw error;
    }
  }

  static async getByEmail(email) {
    const query = "SELECT * FROM users WHERE email = $1";
    try {
      const result = await pool.query(query, [email]);
      return result.rows[0] || null;
    } catch (error) {
      throw error;
    }
  }
  static async delete(id) {
    const query =
      "DELETE FROM users WHERE id = $1 RETURNING id, username, email, phone, location, created_at, updated_at";
    try {
      const result = await pool.query(query, [id]);
      return result.rows[0] || null;
    } catch (error) {
      throw error;
    }
  }
  static async getAll() {
    const query =
      "SELECT id, username, email, phone, location, created_at, updated_at FROM users ORDER BY created_at DESC";
    try {
      const result = await pool.query(query);
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  static async verifyPassword(user, password) {
    return bcrypt.compare(password, user.password);
  }
  static async changePassword(userId, newPassword) {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const query =
      "UPDATE users SET password = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING id";
    try {
      const result = await pool.query(query, [hashedPassword, userId]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async setResetToken(email) {
    const token = crypto.randomBytes(20).toString("hex");
    const expiry = new Date(Date.now() + 3600000); // Token valid for 1 hour
    const query =
      "UPDATE users SET reset_token = $1, reset_token_expiry = $2 WHERE email = $3 RETURNING id";
    try {
      const result = await pool.query(query, [token, expiry, email]);
      return result.rows[0] ? token : null;
    } catch (error) {
      throw error;
    }
  }

  static async resetPassword(token, newPassword) {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const query = `
      UPDATE users 
      SET password = $1, reset_token = NULL, reset_token_expiry = NULL, updated_at = CURRENT_TIMESTAMP 
      WHERE reset_token = $2 AND reset_token_expiry > CURRENT_TIMESTAMP 
      RETURNING id
    `;
    try {
      const result = await pool.query(query, [hashedPassword, token]);
      return result.rows[0] || null;
    } catch (error) {
      throw error;
    }
  }
  static async verifyPassword(user, password) {
    if (!user.password) {
      throw new Error("User has no stored password");
    }
    return bcrypt.compare(password, user.password);
  }
}

export default User;