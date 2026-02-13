import { pool } from '../../config/db';

type GoalStatus = "on-track" | "ahead" | "behind";

function computeStatus(
  target: number,
  current: number,
  deadline?: string
): GoalStatus {
  if (!deadline) return current >= target ? "ahead" : "on-track";

  const now = new Date();
  const end = new Date(deadline);
  const totalMs = end.getTime() - now.getTime();

  // If past deadline
  if (totalMs <= 0) {
    return current >= target ? "ahead" : "behind";
  }

  // Simple heuristic: progress vs time elapsed
  const progressPct = current / target;
  return progressPct >= 1 ? "ahead" : "on-track";
}

export async function getGoalsByUser(userId: string) {
  const res = await pool.query(
    `
    SELECT id, title, category, target_amount, current_amount,
           deadline, status, created_at
    FROM goals
    WHERE user_id = $1
    ORDER BY created_at DESC
    `,
    [userId]
  );

  return res.rows;
}

export async function createGoal(
  userId: string,
  input: {
    title: string;
    category?: string;
    targetAmount: number;
    deadline?: string;
  }
) {
  const { title, category, targetAmount, deadline } = input;

  const status = computeStatus(targetAmount, 0, deadline);

  const res = await pool.query(
    `
    INSERT INTO goals
      (user_id, title, category, target_amount, current_amount, deadline, status)
    VALUES
      ($1, $2, $3, $4, 0, $5, $6)
    RETURNING *
    `,
    [userId, title, category, targetAmount, deadline, status]
  );

  return res.rows[0];
}

/**
 * Add funds to a goal (ACID-safe)
 */
export async function addFundsToGoal(
  userId: string,
  goalId: string,
  amount: number
) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Lock goal row
    const goalRes = await client.query(
      `
      SELECT id, target_amount, current_amount, deadline
      FROM goals
      WHERE id = $1 AND user_id = $2
      FOR UPDATE
      `,
      [goalId, userId]
    );

    if (goalRes.rowCount === 0) {
      throw new Error("Goal not found");
    }

    const goal = goalRes.rows[0];
    const newAmount = Number(goal.current_amount) + amount;
    const newStatus = computeStatus(
      Number(goal.target_amount),
      newAmount,
      goal.deadline
    );

    await client.query(
      `
      UPDATE goals
      SET current_amount = $1,
          status = $2,
          updated_at = NOW()
      WHERE id = $3
      `,
      [newAmount, newStatus, goalId]
    );

    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

export async function updateGoal(
  userId: string,
  goalId: string,
  updates: {
    title?: string;
    category?: string;
    targetAmount?: number;
    deadline?: string;
  }
) {
  // Fetch current to recompute status if needed
  const cur = await pool.query(
    `
    SELECT target_amount, current_amount, deadline
    FROM goals
    WHERE id = $1 AND user_id = $2
    `,
    [goalId, userId]
  );

  if (cur.rowCount === 0) {
    throw new Error("Goal not found");
  }

  const target = updates.targetAmount ?? cur.rows[0].target_amount;
  const deadline = updates.deadline ?? cur.rows[0].deadline;
  const current = cur.rows[0].current_amount;
  const status = computeStatus(target, current, deadline);

  const res = await pool.query(
    `
    UPDATE goals
    SET
      title = COALESCE($1, title),
      category = COALESCE($2, category),
      target_amount = COALESCE($3, target_amount),
      deadline = COALESCE($4, deadline),
      status = $5,
      updated_at = NOW()
    WHERE id = $6 AND user_id = $7
    RETURNING *
    `,
    [
      updates.title,
      updates.category,
      updates.targetAmount,
      updates.deadline,
      status,
      goalId,
      userId
    ]
  );

  return res.rows[0];
}

export async function deleteGoal(userId: string, goalId: string) {
  const res = await pool.query(
    `
    DELETE FROM goals
    WHERE id = $1 AND user_id = $2
    `,
    [goalId, userId]
  );

  if (res.rowCount === 0) {
    throw new Error("Goal not found");
  }
}
