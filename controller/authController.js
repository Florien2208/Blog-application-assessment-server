import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import { validatePassword } from "../utils/validation.js";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.getByEmail(email);

    if (!user || !(await User.verifyPassword(user, password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ userId: user.id, userEmail:user.email }, JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({
      message: "Login successfully",
      token,
      user
    });
  } catch (error) {
    console.error("Error in login:", error);
    res
      .status(500)
      .json({ message: "Error during login", error: error.message });
  }
};

export const logout = (req, res) => {
  // Since we're using JWT, we don't need to do anything server-side for logout
  // The client should remove the token from storage
  res.json({ message: "Logout successful" });
};

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!req.user || !req.user.userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const userId = req.user.userId;

    const user = await User.getById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!(await User.verifyPassword(user, currentPassword))) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    if (!validatePassword(newPassword)) {
      return res.status(400).json({ message: "Invalid new password" });
    }

    await User.changePassword(userId, newPassword);
    res.json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Error in changePassword:", error);
    res
      .status(500)
      .json({ message: "Error changing password", error: error.message });
  }
};

export const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.getByEmail(email);

    if (user) {
      const resetToken = await User.setResetToken(email);
      // In a real application, you would send this token to the user's email
      console.log(`Password reset token for ${email}: ${resetToken}`);
    }

    // Always return a success message to prevent email enumeration
    res.json({ message: "If the email exists, a reset token has been sent." });
  } catch (error) {
    console.error("Error in requestPasswordReset:", error);
    res
      .status(500)
      .json({
        message: "Error requesting password reset",
        error: error.message,
      });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!validatePassword(newPassword)) {
      return res.status(400).json({ message: "Invalid new password" });
    }

    const result = await User.resetPassword(token, newPassword);
    if (result) {
      res.json({ message: "Password reset successfully" });
    } else {
      res.status(400).json({ message: "Invalid or expired reset token" });
    }
  } catch (error) {
    console.error("Error in resetPassword:", error);
    res
      .status(500)
      .json({ message: "Error resetting password", error: error.message });
  }
};
