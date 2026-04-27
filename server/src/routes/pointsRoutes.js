import { Router } from "express";
import { verifyJWT, requireRole } from "../middleware/auth.js";
import { listPoints, createPoint, updatePoint, deletePoint } from "../controllers/pointsController.js";

const router = Router();

router.get("/", listPoints);

// CRUD solo admin
router.post("/", verifyJWT, requireRole("admin"), createPoint);
router.put("/:id", verifyJWT, requireRole("admin"), updatePoint);
router.delete("/:id", verifyJWT, requireRole("admin"), deletePoint);

export default router;
