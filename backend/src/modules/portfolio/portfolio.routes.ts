import { Router } from "express";
import { authenticateToken as auth } from "../../middleware/authMiddleware";
import { getPortfolio, buy, sell, addCash } from "./portfolio.controller";

const router = Router();

router.get("/", auth, getPortfolio);
router.post("/buy", auth, buy);
router.post("/sell", auth, sell);
router.post("/add-cash", auth,addCash);
export default router;
