import express from "express";
import { authenticateToken } from "../middleware/auth.js";
import {
  changePassword,
  login,
  logout,
  requestPasswordReset,
  resetPassword,
} from "../controller/authController.js";

const authRoute = express.Router();

authRoute.post("/login", login);
authRoute.post("/logout", logout);
authRoute.post("/change-password",authenticateToken, changePassword);
authRoute.post("/request-password-reset", requestPasswordReset);
authRoute.post("/reset-password", resetPassword);

export default authRoute;
