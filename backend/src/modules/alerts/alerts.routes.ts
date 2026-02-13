import { Router } from "express";
import { authenticateToken as auth } from "../../middleware/authMiddleware"; // Rename the import to 'auth'
import {
  listAlerts,
  create,
  toggle,
  remove,
  listNotifications,
  markRead
} from "./alerts.controller";

const router = Router();

router.get("/", auth, listAlerts);
router.post("/", auth, create);
router.patch("/:alertId/toggle", auth, toggle);
router.delete("/:alertId", auth, remove);

router.get("/notifications", auth, listNotifications);
router.patch("/notifications/:notificationId/read", auth, markRead);

export default router;