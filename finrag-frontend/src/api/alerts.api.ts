import { apiClient } from "./client";

export async function fetchAlerts() {
  const res = await apiClient.get("/alerts");
  return res.data;
}

export async function createAlert(payload: {
  type: string;
  title: string;
  condition: string;
  priority?: string;
}) {
  const res = await apiClient.post("/alerts", payload);
  return res.data;
}

export async function markAlertRead(notificationId: string) {
  const res = await apiClient.patch(
    `/alerts/notifications/${notificationId}/read`
  );
  return res.data;
}
