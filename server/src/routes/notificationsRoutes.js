import { Router } from "express";
import { verifyJWT } from "../middleware/auth.js";
import {
  deleteNotification,
  listMyNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "../controllers/notificationsController.js";

const router = Router();

router.get("/me", verifyJWT, listMyNotifications);
router.put("/read-all", verifyJWT, markAllNotificationsRead);
router.put("/:id/read", verifyJWT, markNotificationRead);
router.delete("/:id", verifyJWT, deleteNotification);

export default router;
