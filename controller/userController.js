import User from "../models/userModel.js";
import {
  validateEmail,
  validatePassword,
  validateUsername,
} from "../utils/validation.js";
import jwt from "jsonwebtoken";
export const signup = async (req, res) => {
  const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";
  try {
    const { username, email, password, phone, location } = req.body;

    // Validate input
    if (!validateUsername(username)) {
      return res.status(400).json({ message: "Invalid username" });
    }
    if (!validateEmail(email)) {
      return res.status(400).json({ message: "Invalid email" });
    }
    if (!validatePassword(password)) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // Check if email already exists
    const existingUser = await User.getByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const newUser = await User.create(
      username,
      email,
      password,
      phone,
      location
    );
    const token = jwt.sign(
      { userId: newUser.id, userEmail: newUser.email },
      JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );
    res
      .status(201)
      .json({ message: "User created successfully",token, user: newUser });
  } catch (error) {
    console.error("Error in signup:", error);
    if (
      error.message === "Email already exists" ||
      error.message === "Username already exists"
    ) {
      res.status(400).json({ message: error.message });
    } else {
      res
        .status(500)
        .json({ message: "Error creating user", error: error.message });
    }
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updateFields = req.body;

    // Validate input if present
    if (updateFields.username && !validateUsername(updateFields.username)) {
      return res.status(400).json({ message: "Invalid username" });
    }
    if (updateFields.email && !validateEmail(updateFields.email)) {
      return res.status(400).json({ message: "Invalid email" });
    }
    if (updateFields.password && !validatePassword(updateFields.password)) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const updatedUser = await User.update(id, updateFields);
    res.json({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Error in updateUser:", error);
    if (
      error.message === "Email already exists" ||
      error.message === "Username already exists"
    ) {
      res.status(400).json({ message: error.message });
    } else {
      res
        .status(500)
        .json({ message: "Error updating user", error: error.message });
    }
  }
};

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.getById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "user found successfully", user: user });
  } catch (error) {
    console.error("Error in getUserById:", error);
    res
      .status(500)
      .json({ message: "Error fetching user", error: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await User.delete(id);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User deleted successfully", user: deletedUser });
  } catch (error) {
    console.error("Error in deleteUser:", error);
    res
      .status(500)
      .json({ message: "Error deleting user", error: error.message });
  }
};
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.getAll();
    res.json({
      message: "all Users successfully",
      count: users.length,
      allUser: users,
    });
  } catch (error) {
    console.error("Error in getAllUsers:", error);
    res
      .status(500)
      .json({ message: "Error fetching users", error: error.message });
  }
};
