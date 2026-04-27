import { Router } from "express";
import { verifyJWT, requireRole } from "../middleware/auth.js";
import {
  approveEcoActionController,
  createEcoAction,
  listAdminEcoActions,
  listMyEcoActions,
  rejectEcoActionController,
} from "../controllers/ecoActionsController.js";

const router = Router();

router.get("/me", verifyJWT, listMyEcoActions);
router.get("/", verifyJWT, requireRole("admin"), listAdminEcoActions);
router.post("/", verifyJWT, createEcoAction);
router.put("/:id/approve", verifyJWT, requireRole("admin"), approveEcoActionController);
router.put("/:id/reject", verifyJWT, requireRole("admin"), rejectEcoActionController);

export default router;
