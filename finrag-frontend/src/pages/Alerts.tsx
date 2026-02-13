"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth"
import { useAlerts } from "../hooks/useAlerts";

import MobileHeader from "../components/MobileHeader";
import Sidebar from "../components/Sidebar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Plus, User } from "lucide-react";

export default function Alerts() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { alerts, loading } = useAlerts();

  const [isCreateAlertOpen, setIsCreateAlertOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        Loading alerts…
      </div>
    );
  }

  if (!alerts) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        No alerts available
      </div>
    );
  }

  // Destructure alerts only after ensuring it's not null
  const { summary, activeAlerts, notifications, settings } = alerts;

  return (
    <div className="min-h-screen bg-gray-50">
      <MobileHeader />
      <Sidebar />

      <main className="md:ml-64 p-4">
        {/* Header */}
        <div className="hidden md:flex justify-between mb-6 bg-white p-6 rounded-lg shadow">
          <div>
            <h1 className="text-2xl font-bold">Alerts & Notifications</h1>
            <p className="text-gray-600">Manage your financial alerts</p>
          </div>

          <div className="flex items-center gap-4">
            <Dialog open={isCreateAlertOpen} onOpenChange={setIsCreateAlertOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" /> Create Alert
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Alert</DialogTitle>
                </DialogHeader>
              </DialogContent>
            </Dialog>

            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback>{user?.email?.[0]?.toUpperCase() || <User className="h-4 w-4" />}</AvatarFallback>
            </Avatar>
          </div>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <SummaryCard title="Active Alerts" value={summary.active} />
          <SummaryCard title="Triggered Today" value={summary.triggeredToday} />
          <SummaryCard title="Unread" value={summary.unread} />
          <SummaryCard title="This Week" value={summary.weekTotal} />
        </div>

        {/* Active Alerts */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Active Alerts</CardTitle>
            <CardDescription>Currently monitored alerts</CardDescription>
          </CardHeader>
          <CardContent>
            {activeAlerts.map((alert) => (
              <div key={alert.id} className="flex justify-between p-3 border rounded-lg mb-3">
                <div>
                  <div className="font-medium">{alert.title}</div>
                  <div className="text-sm text-muted-foreground">{alert.description}</div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

function SummaryCard({ title, value }: { title: string; value: number }) {
  return (
    <Card>
      <CardHeader className="flex justify-between pb-2">
        <CardTitle className="text-sm">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}