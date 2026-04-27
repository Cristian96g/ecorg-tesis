import { Router } from "express";
import { login, register, me } from "../controllers/authController.js";
import { verifyJWT } from "../middleware/auth.js";

const router = Router();
router.post("/register", register);
router.post("/login", login);
router.get("/me", verifyJWT, me);
export default router;
