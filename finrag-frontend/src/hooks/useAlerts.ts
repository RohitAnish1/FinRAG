import { useEffect, useState } from "react";
import * as alertsApi from "../api/alerts.api";

// Define the structure of the alerts object
type AlertsData = {
  summary: {
    active: number;
    triggeredToday: number;
    unread: number;
    weekTotal: number;
  };
  activeAlerts: {
    id: string;
    title: string;
    description: string;
    triggered: boolean;
  }[];
  notifications: {
    id: string;
    title: string;
    message: string;
    time: string;
    read: boolean;
  }[];
  settings: {
    id: string;
    name: string;
    description: string;
    enabled: boolean;
  }[];
};

export function useAlerts() {
  const [alerts, setAlerts] = useState<AlertsData | null>(null); // Use the defined type
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const data = await alertsApi.fetchAlerts();
    setAlerts(data);
    setLoading(false);
  }

  async function markRead(notificationId: string) {
    await alertsApi.markAlertRead(notificationId);
    await load();
  }

  useEffect(() => {
    load();
  }, []);

  return {
    alerts,
    loading,
    markRead,
    refresh: load,
  };
}