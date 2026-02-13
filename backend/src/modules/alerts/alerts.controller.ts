import { Request, Response } from "express";
import {
  getAlertsByUser,
  createAlert,
  toggleAlert,
  deleteAlert,
  getNotifications,
  markNotificationRead
} from "./alerts.service";

export async function listAlerts(
  req: Request,
  res: Response
) {
  if (!req.user?.id) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const alerts = await getAlertsByUser(req.user.id);
  res.json(alerts);
}

export async function create(
  req: Request,
  res: Response
) {
  const { type, title, condition, priority } = req.body;

  if (!type || !title || !condition) {
    return res.status(400).json({ message: "Missing fields" });
  }

  if (!req.user?.id) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const alert = await createAlert(req.user.id, {
    type,
    title,
    condition,
    priority
  });

  res.status(201).json(alert);
}

export async function toggle(
  req: Request,
  res: Response
) {
  const { alertId } = req.params;
  const { isActive } = req.body;

  if (!req.user?.id) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const alert = await toggleAlert(req.user.id, alertId, isActive);
    res.json(alert);
  } catch (err: any) {
    res.status(404).json({ message: err.message });
  }
}

export async function remove(
  req: Request,
  res: Response
) {
  const { alertId } = req.params;

  if (!req.user?.id) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    await deleteAlert(req.user.id, alertId);
    res.json({ message: "Alert deleted" });
  } catch (err: any) {
    res.status(404).json({ message: err.message });
  }
}

export async function listNotifications(
  req: Request,
  res: Response
) {
  if (!req.user?.id) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const notifications = await getNotifications(req.user.id);
  res.json(notifications);
}

export async function markRead(
  req: Request,
  res: Response
) {
  const { notificationId } = req.params;

  if (!req.user?.id) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    await markNotificationRead(req.user.id, notificationId);
    res.json({ message: "Notification marked as read" });
  } catch (err: any) {
    res.status(404).json({ message: err.message });
  }
}