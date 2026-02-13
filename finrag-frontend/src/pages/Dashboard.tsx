"use client"

import { useNavigate } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"
import { usePortfolio } from "../hooks/usePortfolio"
import { useAnalytics } from "../hooks/useAnalytics"

import MobileHeader from "../components/MobileHeader"
import Sidebar from "../components/Sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Badge } from "../components/ui/badge"
import { Avatar, AvatarFallback } from "../components/ui/avatar"

import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  BarChart3,
  MessageSquare,
  Bell,
  Home,
  Wallet,
  Target,
  AlertTriangle,
  User,
} from "lucide-react"

export default function Dashboard() {
  const navigate = useNavigate()

  const { user, logout } = useAuth()
  const { portfolio, loading: portfolioLoading } = usePortfolio()
  const { analytics, loading: analyticsLoading } = useAnalytics()

  if (portfolioLoading || analyticsLoading) {
    return <div className="p-6">Loading dashboard...</div>
  }

  const portfolioData = [
    {
      name: "Total Portfolio",
      value: `₹${analytics?.totalValue ?? 0}`,
      change: analytics?.totalChangePct ?? "+0%",
      positive: (analytics?.totalChangePct ?? "").startsWith("+"),
    },
    {
      name: "Today's P&L",
      value: `₹${analytics?.dailyPnL ?? 0}`,
      change: analytics?.dailyChangePct ?? "+0%",
      positive: (analytics?.dailyChangePct ?? "").startsWith("+"),
    },
    {
      name: "Monthly Return",
      value: `₹${analytics?.monthlyPnL ?? 0}`,
      change: analytics?.monthlyChangePct ?? "+0%",
      positive: (analytics?.monthlyChangePct ?? "").startsWith("+"),
    },
    {
      name: "Cash Balance",
      value: `₹${portfolio?.cashBalance ?? 0}`,
      change: "",
      positive: true,
    },
  ]

  const holdings = portfolio?.holdings?.slice(0, 4) ?? []

  return (
    <div className="min-h-screen bg-gray-50">
      <MobileHeader showSidebarButton />
      <Sidebar />

      <main className="md:ml-64 p-4">
        {/* Desktop Header */}
        <div className="hidden md:flex items-center justify-between mb-6 bg-white p-6 rounded-lg shadow">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Here's your portfolio overview.</p>
          </div>

          <div className="flex items-center gap-4">
            <Button onClick={() => navigate("/chat")} size="sm">
              Ask AI Assistant
            </Button>

            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback>
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div className="text-right">
                <div className="text-xs text-gray-500">{user?.email}</div>
              </div>
            </div>

            <Button variant="ghost" size="sm" onClick={logout}>
              Log out
            </Button>
          </div>
        </div>

        {/* Mobile title */}
        <div className="md:hidden mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back</p>
        </div>

        {/* Portfolio Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {portfolioData.map((item, index) => (
            <Card key={index} className="bg-white">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm text-gray-600">{item.name}</CardTitle>
                {item.positive ? (
                  <TrendingUp className="h-4 w-4 text-green-600" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-600" />
                )}
              </CardHeader>

              <CardContent>
                <div className="text-xl font-bold">{item.value}</div>
                {item.change && (
                  <Badge
                    className={`mt-2 ${
                      item.positive
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {item.change}
                  </Badge>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Holdings + AI Alerts */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Holdings */}
          <Card className="bg-white">
            <CardHeader>
              <CardTitle>Top Holdings</CardTitle>
              <CardDescription>Your largest portfolio positions</CardDescription>
            </CardHeader>

            <CardContent>
              <div className="space-y-4">
                {holdings.map((h: any, i: number) => (
                  <div key={i} className="flex justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium">{h.symbol}</div>
                      <div className="text-sm text-gray-500">{h.shares} shares</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">₹{h.currentValue}</div>
                      <div
                        className={`text-sm ${
                          h.pnl >= 0 ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {h.pnl >= 0 ? "+" : ""}₹{h.pnl}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* AI Alerts (static for now) */}
          <Card className="bg-white">
            <CardHeader>
              <CardTitle>AI Insights & Alerts</CardTitle>
              <CardDescription>Personalized recommendations</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex gap-3">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  <div>
                    <div className="font-medium text-red-800">Risk Alert</div>
                    <div className="text-sm text-gray-600">
                      Concentration risk detected in portfolio.
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
