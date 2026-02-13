import { apiClient } from "./client";

export async function fetchGoals() {
  const res = await apiClient.get("/goals");
  return res.data;
}

export async function updateGoal(
  goalId: string,
  currentAmount: number
) {
  const res = await apiClient.patch(`/goals/${goalId}`, {
    currentAmount,
  });
  return res.data;
}

export async function createGoal(goal: any) {
  const res = await apiClient.post("/goals", goal);
  return res.data;
}
