"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import MobileHeader from "../components/MobileHeader"
import Sidebar from "../components/Sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Badge } from "../components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Avatar, AvatarFallback} from "../components/ui/avatar"
import { Sheet, SheetContent, SheetTrigger } from "../components/ui/sheet"
import { Progress } from "../components/ui/progress"
import {
  TrendingUp,
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
  Minus,
  Calendar,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"

export default function Portfolio() {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const [activeTab, setActiveTab] = useState("portfolio")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  const portfolioSummary = {
    totalValue: 124567,
    dayChange: 1234,
    dayChangePercent: 2.1,
    totalGain: 18456,
    totalGainPercent: 17.3,
    cashBalance: 15678,
  }

  const holdings = [
    {
      symbol: "AAPL",
      name: "Apple Inc.",
      shares: 50,
      avgCost: 150.25,
      currentPrice: 175.0,
      value: 8750,
      dayChange: 2.3,
      totalGain: 1237.5,
      totalGainPercent: 16.5,
      allocation: 15.2,
      sector: "Technology",
    },
    {
      symbol: "GOOGL",
      name: "Alphabet Inc.",
      shares: 25,
      avgCost: 220.0,
      currentPrice: 250.0,
      value: 6250,
      dayChange: 1.8,
      totalGain: 750,
      totalGainPercent: 13.6,
      allocation: 10.9,
      sector: "Technology",
    },
    {
      symbol: "TSLA",
      name: "Tesla Inc.",
      shares: 30,
      avgCost: 200.0,
      currentPrice: 240.0,
      value: 7200,
      dayChange: -0.5,
      totalGain: 1200,
      totalGainPercent: 20.0,
      allocation: 12.5,
      sector: "Consumer Discretionary",
    },
    {
      symbol: "MSFT",
      name: "Microsoft Corp.",
      shares: 40,
      avgCost: 280.0,
      currentPrice: 320.0,
      value: 12800,
      dayChange: 3.1,
      totalGain: 1600,
      totalGainPercent: 14.3,
      allocation: 22.3,
      sector: "Technology",
    },
    {
      symbol: "JNJ",
      name: "Johnson & Johnson",
      shares: 60,
      avgCost: 160.0,
      currentPrice: 165.0,
      value: 9900,
      dayChange: 0.8,
      totalGain: 300,
      totalGainPercent: 3.1,
      allocation: 17.2,
      sector: "Healthcare",
    },
  ]

  const sectorAllocation = [
    { sector: "Technology", percentage: 48.6, value: 27800, target: 45.0 },
    { sector: "Healthcare", percentage: 17.2, value: 9900, target: 20.0 },
    { sector: "Consumer Discretionary", percentage: 12.5, value: 7200, target: 15.0 },
    { sector: "Financials", percentage: 8.7, value: 5000, target: 10.0 },
    { sector: "Cash", percentage: 13.0, value: 7467, target: 10.0 },
  ]

  const recentTransactions = [
    { date: "2024-01-15", type: "BUY", symbol: "AAPL", shares: 10, price: 175.0, total: 1750 },
    { date: "2024-01-12", type: "SELL", symbol: "TSLA", shares: 5, price: 240.0, total: 1200 },
    { date: "2024-01-10", type: "BUY", symbol: "JNJ", shares: 20, price: 165.0, total: 3300 },
    { date: "2024-01-08", type: "DIVIDEND", symbol: "MSFT", shares: 40, price: 0.75, total: 30 },
  ]

  const navigationItems = [
    { id: "dashboard", label: "Dashboard", icon: Home, onClick: () => navigate("/dashboard") },
    { id: "portfolio", label: "Portfolio", icon: Wallet, active: true },
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
            <h1 className="text-2xl font-bold text-gray-900">Portfolio Management</h1>
            <p className="text-gray-600">Track and manage your investment portfolio</p>
          </div>
          <div className="flex items-center gap-4">
            <Button onClick={() => navigate("/chat")} size="sm">
              Ask AI Assistant
            </Button>
          </div>
        </div>

        {/* Mobile page title */}
        <div className="md:hidden mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Portfolio</h1>
          <p className="text-gray-600">Manage your investments</p>
        </div>

        {/* Portfolio Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Portfolio</CardTitle>
              <DollarSign className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${portfolioSummary.totalValue.toLocaleString()}</div>
              <Badge variant="default" className="mt-2">
                +{portfolioSummary.totalGainPercent}% All Time
              </Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Today's Change</CardTitle>
              <TrendingUp className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">+${portfolioSummary.dayChange.toLocaleString()}</div>
              <Badge variant="default" className="mt-2">
                +{portfolioSummary.dayChangePercent}%
              </Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Gain</CardTitle>
              <TrendingUp className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">+${portfolioSummary.totalGain.toLocaleString()}</div>
              <Badge variant="default" className="mt-2">
                +{portfolioSummary.totalGainPercent}%
              </Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Cash Balance</CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${portfolioSummary.cashBalance.toLocaleString()}</div>
              <Badge variant="secondary" className="mt-2">
                Available
              </Badge>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="holdings" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="holdings">Holdings</TabsTrigger>
            <TabsTrigger value="allocation">Allocation</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
          </TabsList>

          <TabsContent value="holdings" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <CardTitle>Current Holdings</CardTitle>
                    <CardDescription>Your investment positions and performance</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1 sm:flex-initial">
                      <Filter className="h-4 w-4 mr-2" />
                      Filter
                    </Button>
                    <Button size="sm" className="flex-1 sm:flex-initial">
                      <Plus className="h-4 w-4 mr-2" />
                      Add
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {holdings.map((holding, index) => (
                    <div
                      key={index}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors gap-4"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                          <span className="font-bold text-primary text-sm">{holding.symbol}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium">{holding.symbol}</div>
                          <div className="text-sm text-muted-foreground truncate">{holding.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {holding.shares} shares • {holding.sector}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-4">
                        <div className="text-right">
                          <div className="font-medium">${holding.value.toLocaleString()}</div>
                          <div className="text-sm text-muted-foreground">
                            ${holding.currentPrice.toFixed(2)} per share
                          </div>
                          <div className="flex items-center gap-2 mt-1 justify-end">
                            <Badge variant={holding.dayChange >= 0 ? "default" : "destructive"} className="text-xs">
                              {holding.dayChange >= 0 ? "+" : ""}
                              {holding.dayChange}%
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {holding.allocation}%
                            </Badge>
                          </div>
                        </div>

                        <div className="flex gap-2 flex-shrink-0">
                          <Button variant="outline" size="sm">
                            <Plus className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Minus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="allocation" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Sector Allocation</CardTitle>
                  <CardDescription>Current vs target allocation by sector</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {sectorAllocation.map((sector, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{sector.sector}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">
                              {sector.percentage}% / {sector.target}%
                            </span>
                            {sector.percentage > sector.target ? (
                              <ArrowUpRight className="h-4 w-4 text-orange-500" />
                            ) : sector.percentage < sector.target ? (
                              <ArrowDownRight className="h-4 w-4 text-blue-500" />
                            ) : (
                              <div className="w-4 h-4" />
                            )}
                          </div>
                        </div>
                        <div className="space-y-1">
                          <Progress value={sector.percentage} className="h-2" />
                          <Progress value={sector.target} className="h-1 opacity-50" />
                        </div>
                        <div className="text-xs text-muted-foreground">${sector.value.toLocaleString()}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Rebalancing Suggestions</CardTitle>
                  <CardDescription>AI-powered portfolio optimization</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 rounded-lg bg-orange-50 border border-orange-200">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5" />
                        <div>
                          <div className="font-medium text-orange-800">Overweight Technology</div>
                          <div className="text-sm text-orange-700 mt-1">
                            Consider reducing tech allocation by 3.6% to meet target of 45%
                          </div>
                          <Button variant="outline" size="sm" className="mt-2 bg-transparent">
                            View Suggestions
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                      <div className="flex items-start gap-3">
                        <TrendingUp className="h-5 w-5 text-blue-600 mt-0.5" />
                        <div>
                          <div className="font-medium text-blue-800">Underweight Healthcare</div>
                          <div className="text-sm text-blue-700 mt-1">
                            Consider increasing healthcare allocation by 2.8%
                          </div>
                          <Button variant="outline" size="sm" className="mt-2 bg-transparent">
                            Explore Options
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                      <div className="flex items-start gap-3">
                        <Target className="h-5 w-5 text-green-600 mt-0.5" />
                        <div>
                          <div className="font-medium text-green-800">Optimal Cash Level</div>
                          <div className="text-sm text-green-700 mt-1">
                            Your cash allocation is well-positioned for opportunities
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Analytics</CardTitle>
                <CardDescription>Portfolio performance metrics and analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">Sharpe Ratio</div>
                    <div className="text-2xl font-bold">1.24</div>
                    <div className="text-xs text-success">Excellent risk-adjusted returns</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">Beta</div>
                    <div className="text-2xl font-bold">1.15</div>
                    <div className="text-xs text-muted-foreground">15% more volatile than market</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">Max Drawdown</div>
                    <div className="text-2xl font-bold">-18.2%</div>
                    <div className="text-xs text-muted-foreground">Largest peak-to-trough decline</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transactions" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <CardTitle>Recent Transactions</CardTitle>
                    <CardDescription>Your latest trading activity</CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">Filter by Date</span>
                    <span className="sm:hidden">Filter</span>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentTransactions.map((transaction, index) => (
                    <div key={index} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border bg-card gap-4">
                      <div className="flex items-center gap-4 flex-1">
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                            transaction.type === "BUY"
                              ? "bg-green-100 text-green-600"
                              : transaction.type === "SELL"
                                ? "bg-red-100 text-red-600"
                                : "bg-blue-100 text-blue-600"
                          }`}
                        >
                          {transaction.type === "BUY" ? (
                            <Plus className="h-5 w-5" />
                          ) : transaction.type === "SELL" ? (
                            <Minus className="h-5 w-5" />
                          ) : (
                            <DollarSign className="h-5 w-5" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium">
                            {transaction.type} {transaction.symbol}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {transaction.shares} shares @ ${transaction.price.toFixed(2)}
                          </div>
                          <div className="text-xs text-muted-foreground">{transaction.date}</div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between sm:justify-end gap-4">
                        <div className="text-right">
                          <div className="font-medium">${transaction.total.toLocaleString()}</div>
                          <Badge variant="outline" className="text-xs mt-1">
                            {transaction.type}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
