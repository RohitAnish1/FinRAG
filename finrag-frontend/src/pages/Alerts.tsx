"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import MobileHeader from "../components/MobileHeader"
import Sidebar from "../components/Sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Badge } from "../components/ui/badge"
import { Switch } from "../components/ui/switch"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import { Sheet, SheetContent, SheetTrigger } from "../components/ui/sheet"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog"
import {
  DollarSign,
  BarChart3,
  MessageSquare,
  Bell,
  Settings,
  LogOut,
  Home,
  Wallet,
  Target,
  AlertTriangle,
  Menu,
  User,
  Plus,
  Clock,
  CheckCircle,
  XCircle,
  Calendar,
} from "lucide-react"
import type { User as SupabaseUser } from '@supabase/supabase-js'

export interface ExtendedUser extends SupabaseUser {
  avatar?: string
  name?: string
}

// Add the mapUser function
const mapUser = (supabaseUser: SupabaseUser | null): ExtendedUser | null => {
  if (!supabaseUser) return null;
  
  return {
    ...supabaseUser,
    avatar: supabaseUser.user_metadata?.avatar_url,
    name: supabaseUser.user_metadata?.full_name || supabaseUser.email?.split('@')[0]
  }
}

export default function Alerts() {
  const navigate = useNavigate()
  const { user: authUser, logout } = useAuth()
  const [isCreateAlertOpen, setIsCreateAlertOpen] = useState(false)

  // Update user state to use mapped user
  const user = mapUser(authUser)

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  const activeAlerts = [
    {
      id: 1,
      type: "Price Alert",
      title: "AAPL Price Target",
      description: "Apple Inc. reaches $180.00",
      status: "active",
      created: "2024-01-15",
      triggered: false,
      priority: "medium",
    },
    {
      id: 2,
      type: "Portfolio Alert",
      title: "Portfolio Rebalancing",
      description: "Tech allocation exceeds 70%",
      status: "active",
      created: "2024-01-14",
      triggered: true,
      priority: "high",
    },
    {
      id: 3,
      type: "Market Alert",
      title: "VIX Spike Warning",
      description: "Volatility index above 25",
      status: "active",
      created: "2024-01-13",
      triggered: false,
      priority: "low",
    },
    {
      id: 4,
      type: "News Alert",
      title: "Fed Meeting Updates",
      description: "FOMC meeting announcements",
      status: "active",
      created: "2024-01-12",
      triggered: true,
      priority: "high",
    },
  ]

  const recentNotifications = [
    {
      id: 1,
      title: "Portfolio Rebalancing Needed",
      message: "Your tech allocation has exceeded the target by 5.2%",
      time: "2 hours ago",
      type: "warning",
      read: false,
    },
    {
      id: 2,
      title: "MSFT Dividend Announced",
      message: "Microsoft declared quarterly dividend of $0.75 per share",
      time: "4 hours ago",
      type: "info",
      read: true,
    },
    {
      id: 3,
      title: "Market Volatility Alert",
      message: "VIX has increased by 15% in the last hour",
      time: "6 hours ago",
      type: "alert",
      read: false,
    },
    {
      id: 4,
      title: "Goal Progress Update",
      message: "You're 85% towards your retirement savings goal",
      time: "1 day ago",
      type: "success",
      read: true,
    },
  ]

  const alertSettings = [
    { name: "Price Alerts", description: "Stock price movements", enabled: true },
    { name: "Portfolio Alerts", description: "Portfolio allocation changes", enabled: true },
    { name: "Market Alerts", description: "Market volatility and news", enabled: false },
    { name: "Goal Alerts", description: "Financial goal progress", enabled: true },
    { name: "Email Notifications", description: "Send alerts via email", enabled: false },
    { name: "Push Notifications", description: "Browser push notifications", enabled: true },
  ]

  const navigationItems = [
    { id: "dashboard", label: "Dashboard", icon: Home, onClick: () => navigate("/dashboard") },
    { id: "portfolio", label: "Portfolio", icon: Wallet, onClick: () => navigate("/portfolio") },
    { id: "chat", label: "AI Assistant", icon: MessageSquare, onClick: () => navigate("/chat") },
    { id: "goals", label: "Goals", icon: Target, onClick: () => navigate("/goals") },
    { id: "analytics", label: "Analytics", icon: BarChart3, onClick: () => navigate("/analytics") },
    { id: "alerts", label: "Alerts", icon: Bell, active: true },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header (visible on phones) */}
      <MobileHeader />

      {/* Desktop Sidebar (visible on large screens) */}
      <Sidebar />

      {/* Main Page Content */}
      <main className="md:ml-64 p-4">
        {/* Desktop Header */}
        <div className="hidden md:flex items-center justify-between mb-6 bg-white p-6 rounded-lg shadow">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Alerts & Notifications</h1>
            <p className="text-gray-600">Manage your financial alerts and notifications</p>
          </div>
          <div className="flex items-center gap-4">
            <Dialog open={isCreateAlertOpen} onOpenChange={setIsCreateAlertOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Alert
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Alert</DialogTitle>
                  <DialogDescription>Set up a new financial alert to stay informed</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="alert-type">Alert Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select alert type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="price">Price Alert</SelectItem>
                        <SelectItem value="portfolio">Portfolio Alert</SelectItem>
                        <SelectItem value="market">Market Alert</SelectItem>
                        <SelectItem value="news">News Alert</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="alert-title">Alert Title</Label>
                    <Input id="alert-title" placeholder="Enter alert title" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="alert-condition">Condition</Label>
                    <Input id="alert-condition" placeholder="e.g., AAPL > $180" />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsCreateAlertOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={() => setIsCreateAlertOpen(false)}>Create Alert</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.avatar || "/placeholder.svg"} />
                <AvatarFallback>
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div className="text-right">
                <div className="text-sm font-medium">{user?.name}</div>
                <div className="text-xs text-gray-500">{user?.email}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile page title with create button */}
        <div className="md:hidden mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Alerts</h1>
            <p className="text-gray-600">Manage notifications</p>
          </div>
          <Dialog open={isCreateAlertOpen} onOpenChange={setIsCreateAlertOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Create
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Alert</DialogTitle>
                <DialogDescription>Set up a new financial alert to stay informed</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="alert-type">Alert Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select alert type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="price">Price Alert</SelectItem>
                      <SelectItem value="portfolio">Portfolio Alert</SelectItem>
                      <SelectItem value="market">Market Alert</SelectItem>
                      <SelectItem value="news">News Alert</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="alert-title">Alert Title</Label>
                  <Input id="alert-title" placeholder="Enter alert title" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="alert-condition">Condition</Label>
                  <Input id="alert-condition" placeholder="e.g., AAPL > $180" />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsCreateAlertOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => setIsCreateAlertOpen(false)}>Create Alert</Button>
                  </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Alert Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Alerts</CardTitle>
              <Bell className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeAlerts.length}</div>
              <Badge variant="default" className="mt-2">
                Monitoring
              </Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Triggered Today</CardTitle>
              <AlertTriangle className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2</div>
              <Badge variant="secondary" className="mt-2">
                Notifications
              </Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Unread</CardTitle>
              <Clock className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <Badge variant="destructive" className="mt-2">
                Pending
              </Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">This Week</CardTitle>
              <Calendar className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <Badge variant="default" className="mt-2">
                Total
              </Badge>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Active Alerts */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Active Alerts</CardTitle>
                  <CardDescription>Your current alert configurations</CardDescription>
                </div>
                <Dialog open={isCreateAlertOpen} onOpenChange={setIsCreateAlertOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Alert
                    </Button>
                  </DialogTrigger>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activeAlerts.map((alert) => (
                  <div key={alert.id} className="flex items-center justify-between p-3 rounded-lg border bg-card">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          alert.triggered
                            ? "bg-orange-500"
                            : alert.status === "active"
                              ? "bg-green-500"
                              : "bg-gray-400"
                        }`}
                      />
                      <div>
                        <div className="font-medium text-sm">{alert.title}</div>
                        <div className="text-xs text-muted-foreground">{alert.description}</div>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {alert.type}
                          </Badge>
                          <Badge
                            variant={
                              alert.priority === "high"
                                ? "destructive"
                                : alert.priority === "medium"
                                  ? "default"
                                  : "secondary"
                            }
                            className="text-xs"
                          >
                            {alert.priority}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {alert.triggered ? (
                        <AlertTriangle className="h-4 w-4 text-orange-500" />
                      ) : (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      )}
                      <Button variant="ghost" size="sm">
                        <XCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Notifications */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Notifications</CardTitle>
              <CardDescription>Latest alerts and updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 rounded-lg border ${notification.read ? "bg-muted/30" : "bg-card"}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-2 h-2 rounded-full ${
                              notification.type === "warning"
                                ? "bg-orange-500"
                                : notification.type === "alert"
                                  ? "bg-red-500"
                                  : notification.type === "success"
                                    ? "bg-green-500"
                                    : "bg-blue-500"
                            }`}
                          />
                          <span className="font-medium text-sm">{notification.title}</span>
                          {!notification.read && <div className="w-2 h-2 bg-primary rounded-full" />}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{notification.message}</p>
                        <p className="text-xs text-muted-foreground mt-2">{notification.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Alert Settings */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Alert Settings</CardTitle>
            <CardDescription>Configure your notification preferences</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {alertSettings.map((setting, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg border bg-card">
                  <div>
                    <div className="font-medium text-sm">{setting.name}</div>
                    <div className="text-xs text-muted-foreground">{setting.description}</div>
                  </div>
                  <Switch checked={setting.enabled} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
