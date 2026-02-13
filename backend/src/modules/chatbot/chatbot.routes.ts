import { Router } from "express";
import { authenticateToken as auth } from "../../middleware/authMiddleware";
import { chat, history } from "./chatbot.controller";

const router = Router();

router.post("/query", auth, chat);
router.get("/history/:conversationId", auth, history);

export default router;
