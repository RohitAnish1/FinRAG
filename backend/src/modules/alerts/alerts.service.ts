import { pool } from "../../config/db";

/**
 * Fetch all alert rules for a user
 */
export async function getAlertsByUser(userId: string) {
  const res = await pool.query(
    `
    SELECT id, type, title, condition, priority, is_active, created_at
    FROM alerts
    WHERE user_id = $1
    ORDER BY created_at DESC
    `,
    [userId]
  );

  return res.rows;
}

export async function createAlert(
  userId: string,
  input: {
    type: string;
    title: string;
    condition: string;
    priority?: string;
  }
) {
  const { type, title, condition, priority = "medium" } = input;

  const res = await pool.query(
    `
    INSERT INTO alerts
      (user_id, type, title, condition, priority)
    VALUES
      ($1, $2, $3, $4, $5)
    RETURNING *
    `,
    [userId, type, title, condition, priority]
  );

  return res.rows[0];
}

export async function toggleAlert(
  userId: string,
  alertId: string,
  isActive: boolean
) {
  const res = await pool.query(
    `
    UPDATE alerts
    SET is_active = $1
    WHERE id = $2 AND user_id = $3
    RETURNING *
    `,
    [isActive, alertId, userId]
  );

  if (res.rowCount === 0) {
    throw new Error("Alert not found");
  }

  return res.rows[0];
}

export async function deleteAlert(userId: string, alertId: string) {
  const res = await pool.query(
    `
    DELETE FROM alerts
    WHERE id = $1 AND user_id = $2
    `,
    [alertId, userId]
  );

  if (res.rowCount === 0) {
    throw new Error("Alert not found");
  }
}

/**
 * Notifications (triggered alerts)
 */
export async function getNotifications(userId: string) {
  const res = await pool.query(
    `
    SELECT id, message, is_read, created_at
    FROM notifications
    WHERE user_id = $1
    ORDER BY created_at DESC
    `,
    [userId]
  );

  return res.rows;
}

export async function markNotificationRead(
  userId: string,
  notificationId: string
) {
  const res = await pool.query(
    `
    UPDATE notifications
    SET is_read = true
    WHERE id = $1 AND user_id = $2
    `,
    [notificationId, userId]
  );

  if (res.rowCount === 0) {
    throw new Error("Notification not found");
  }
}

/**
 * Trigger a notification (called by evaluator / cron later)
 */
export async function createNotification(
  userId: string,
  alertId: string,
  message: string
) {
  await pool.query(
    `
    INSERT INTO notifications
      (user_id, alert_id, message)
    VALUES
      ($1, $2, $3)
    `,
    [userId, alertId, message]
  );
}
