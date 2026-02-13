import { Router } from "express";
import { authenticateToken as auth } from "../../middleware/authMiddleware";
import {
  listGoals,
  create,
  addFunds,
  update,
  remove
} from "./goals.controller";

const router = Router();

router.get("/", auth, listGoals);
router.post("/", auth, create);
router.post("/:goalId/funds", auth, addFunds);
router.patch("/:goalId", auth, update);
router.delete("/:goalId", auth, remove);

export default router;
