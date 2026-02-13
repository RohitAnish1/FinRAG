import { Request, Response } from "express";
import {
  getGoalsByUser,
  createGoal,
  addFundsToGoal,
  updateGoal,
  deleteGoal
} from "./goals.service";

export async function listGoals(
  req: Request,
  res: Response
) {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const goals = await getGoalsByUser(req.user.id);
    res.json(goals);
  } catch {
    res.status(500).json({ message: "Failed to load goals" });
  }
}

export async function create(
  req: Request,
  res: Response
) {
  const { title, category, targetAmount, deadline } = req.body;

  if (!title || !targetAmount) {
    return res.status(400).json({ message: "Missing fields" });
  }

  if (!req.user?.id) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const goal = await createGoal(req.user.id, {
      title,
      category,
      targetAmount,
      deadline
    });

    res.status(201).json(goal);
  } catch {
    res.status(400).json({ message: "Failed to create goal" });
  }
}

export async function addFunds(
  req: Request,
  res: Response
) {
  const { goalId } = req.params;
  const { amount } = req.body;

  if (!amount || amount <= 0) {
    return res.status(400).json({ message: "Invalid amount" });
  }

  if (!req.user?.id) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    await addFundsToGoal(req.user.id, goalId, amount);
    res.json({ message: "Funds added" });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
}

export async function update(
  req: Request,
  res: Response
) {
  const { goalId } = req.params;

  if (!req.user?.id) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const goal = await updateGoal(
      req.user.id,
      goalId,
      req.body
    );
    res.json(goal);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
}

export async function remove(
  req: Request,
  res: Response
) {
  const { goalId } = req.params;

  if (!req.user?.id) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    await deleteGoal(req.user.id, goalId);
    res.json({ message: "Goal deleted" });
  } catch (err: any) {
    res.status(404).json({ message: err.message });
  }
}