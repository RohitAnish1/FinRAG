import { Router } from "express"
import { getAnalytics } from "./analytics.controller"
import { authenticateToken as auth } from "../../middleware/authMiddleware";

const router = Router()

router.get("/", auth, getAnalytics)

export default router