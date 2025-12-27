"use client"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
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
  PieChart,
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
} from "lucide-react"

export default function Dashboard() {
  const navigate = useNavigate()
  const { logout } = useAuth()

  const portfolioData = [
    { name: "Total Portfolio", value: "$124,567", change: "+5.2%", positive: true },
    { name: "Today's P&L", value: "$1,234", change: "+2.1%", positive: true },
    { name: "Monthly Return", value: "$8,456", change: "+12.3%", positive: true },
    { name: "Cash Balance", value: "$15,678", change: "-1.2%", positive: false },
  ]

  const holdings = [
    { symbol: "AAPL", name: "Apple Inc.", shares: 50, value: "$8,750", change: "+2.3%" },
    { symbol: "GOOGL", name: "Alphabet Inc.", shares: 25, value: "$6,250", change: "+1.8%" },
    { symbol: "TSLA", name: "Tesla Inc.", shares: 30, value: "$7,200", change: "-0.5%" },
    { symbol: "MSFT", name: "Microsoft Corp.", shares: 40, value: "$12,800", change: "+3.1%" },
  ]

  const navigationItems = [
    { id: "dashboard", label: "Dashboard", icon: Home, active: true },
    { id: "portfolio", label: "Portfolio", icon: Wallet, onClick: () => navigate("/portfolio") },
    { id: "chat", label: "AI Assistant", icon: MessageSquare, onClick: () => navigate("/chat") },
    { id: "goals", label: "Goals", icon: Target, onClick: () => navigate("/goals") },
    { id: "analytics", label: "Analytics", icon: BarChart3, onClick: () => navigate("/analytics") },
    { id: "alerts", label: "Alerts", icon: Bell, onClick: () => navigate("/alerts") },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header (visible on phones) */}
      <MobileHeader showSidebarButton />

      {/* Desktop Sidebar (visible on large screens) */}
      <Sidebar />

      {/* Main Page Content */}
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
                <div className="text-xs text-gray-500">Logged In</div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile page title */}
        <div className="md:hidden mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back</p>
        </div>

        {/* Portfolio Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
          {portfolioData.map((item, index) => (
            <Card key={index} className="bg-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">{item.name}</CardTitle>
                {item.positive ? (
                  <TrendingUp className="h-4 w-4 text-green-600" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-600" />
                )}
              </CardHeader>
              <CardContent>
                <div className="text-xl lg:text-2xl font-bold">{item.value}</div>
                <Badge
                  className={`mt-2 ${item.positive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                >
                  {item.change}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Holdings and Charts */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6">
          {/* Holdings */}
          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Top Holdings
              </CardTitle>
              <CardDescription>Your largest portfolio positions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {holdings.map((holding, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                    <div>
                      <div className="font-medium">{holding.symbol}</div>
                      <div className="text-sm text-gray-500">{holding.shares} shares</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{holding.value}</div>
                      <div
                        className={`text-sm ${holding.change.startsWith("+") ? "text-green-600" : "text-red-600"}`}
                      >
                        {holding.change}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* AI Insights */}
          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                AI Insights & Alerts
              </CardTitle>
              <CardDescription>Personalized recommendations from your AI advisor</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                  <div className="flex items-start gap-3">
                    <TrendingUp className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <div className="font-medium text-green-800">Portfolio Rebalancing</div>
                      <div className="text-sm text-gray-600 mt-1">
                        Consider rebalancing your tech allocation. Current: 65%, Target: 55%
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                  <div className="flex items-start gap-3">
                    <DollarSign className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <div className="font-medium text-blue-800">Investment Opportunity</div>
                      <div className="text-sm text-gray-600 mt-1">
                        Market dip detected in renewable energy sector. Consider DCA strategy.
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-red-50 border border-red-200">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                    <div>
                      <div className="font-medium text-red-800">Risk Alert</div>
                      <div className="text-sm text-gray-600 mt-1">
                        High correlation detected between AAPL and GOOGL positions.
                      </div>
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
