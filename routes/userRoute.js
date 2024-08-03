import express from "express";
import {
  signup,
  updateUser,
  getUserById,
  deleteUser,
  getAllUsers,
} from "../controller/userController.js";

const router = express.Router();

router.post("/signup", signup);
router.put("/:id", updateUser);
router.get("/:id", getUserById);
router.delete("/:id", deleteUser);
router.get("/", getAllUsers);

export default router;
