import { Router } from "express";
import { verifyJWT, requireRole } from "../middleware/auth.js";
import { uploadReportPhotos } from "../middleware/upload.js";
import {
  createReport,
  listReports,
  getReport,
  updateReport,
  deleteReport,
  setModerationStatus,
  setOperationalState,
} from "../controllers/reportsController.js";

const router = Router();

router.get("/", listReports);
router.get("/:id", getReport);

router.post("/", verifyJWT, uploadReportPhotos.array("fotos", 3), createReport);

router.put("/:id", verifyJWT, requireRole("admin"), uploadReportPhotos.array("fotos", 3), updateReport);
router.delete("/:id", verifyJWT, requireRole("admin"), deleteReport);
router.put("/:id/moderation", verifyJWT, requireRole("admin"), setModerationStatus);
router.put("/:id/estado", verifyJWT, requireRole("admin"), setOperationalState);

export default router;
