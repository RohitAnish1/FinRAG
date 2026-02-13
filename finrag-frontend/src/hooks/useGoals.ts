import { useEffect, useState } from "react";
import * as goalsApi from "../api/goals.api";

export function useGoals() {
  const [goals, setGoals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const data = await goalsApi.fetchGoals();
    setGoals(data);
    setLoading(false);
  }

  async function update(goalId: string, currentAmount: number) {
    await goalsApi.updateGoal(goalId, currentAmount);
    await load();
  }

  useEffect(() => {
    load();
  }, []);

  return {
    goals,
    loading,
    update,
    refresh: load,
  };
}
