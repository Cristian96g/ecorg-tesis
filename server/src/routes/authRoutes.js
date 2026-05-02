import { Router } from "express";
import {
  forgotPassword,
  login,
  me,
  register,
  resetPassword,
} from "../controllers/authController.js";
import { verifyJWT } from "../middleware/auth.js";

const router = Router();
router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.get("/me", verifyJWT, me);
export default router;
