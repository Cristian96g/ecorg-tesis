import { Router } from "express";
import { verifyJWT, requireRole } from "../middleware/auth.js";
import {
  listBarrios,
  createBarrio,
  updateBarrio,
  deleteBarrio,
} from "../controllers/barriosController.js";

const router = Router();

// Listado público para selects y filtros.
router.get("/", listBarrios);

// Operaciones administrativas.
router.post("/", verifyJWT, requireRole("admin"), createBarrio);
router.put("/:id", verifyJWT, requireRole("admin"), updateBarrio);
router.delete("/:id", verifyJWT, requireRole("admin"), deleteBarrio);

export default router;
