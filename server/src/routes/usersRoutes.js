import { Router } from "express";
import {
  me,
  listMyRewards,
  listAdminRewards,
  redeemMyReward,
  updateMe,
  updateAdminReward,
  setRole,
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/usersController.js";
import { verifyJWT, requireRole } from "../middleware/auth.js";
import { uploadAvatar } from "../middleware/upload.js";

const router = Router();

/** Self */
router.get("/me", verifyJWT, me);
router.put("/me", verifyJWT, uploadAvatar.single("avatar"), updateMe);
router.get("/me/rewards", verifyJWT, listMyRewards);
router.post("/me/rewards/:rewardId/redeem", verifyJWT, redeemMyReward);
router.get("/admin/rewards", verifyJWT, requireRole("admin"), listAdminRewards);
router.put("/admin/rewards/:rewardId", verifyJWT, requireRole("admin"), updateAdminReward);

/** Admin CRUD */
router.get("/", verifyJWT, requireRole("admin"), getUsers);
router.post("/", verifyJWT, requireRole("admin"), createUser);
router.get("/:id", verifyJWT, requireRole("admin"), getUserById);
router.put("/:id", verifyJWT, requireRole("admin"), updateUser);
router.delete("/:id", verifyJWT, requireRole("admin"), deleteUser);
router.put("/:id/role", verifyJWT, requireRole("admin"), setRole);

export default router;
