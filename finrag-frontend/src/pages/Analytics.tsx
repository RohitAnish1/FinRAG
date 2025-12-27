"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Badge } from "../components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
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
  Menu,
  User,
  Activity,
  Zap,
  Brain,
  ArrowUp,
  ArrowDown,
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

export default function Analytics() {
  const navigate = useNavigate()
  const { user: authUser, logout } = useAuth()
  const [activeTab, setActiveTab] = useState("analytics")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Update user state to use mapped user
  const user = mapUser(authUser)

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  const marketSentiment = {
    overall: 72,
    trend: "Bullish",
    change: "+5.2%",
    fearGreedIndex: 68,
  }

  const sectorSentiment = [
    { sector: "Technology", sentiment: 78, change: "+3.2%", trend: "up" },
    { sector: "Healthcare", sentiment: 65, change: "+1.8%", trend: "up" },
    { sector: "Financials", sentiment: 58, change: "-2.1%", trend: "down" },
    { sector: "Energy", sentiment: 82, change: "+7.5%", trend: "up" },
    { sector: "Consumer Discretionary", sentiment: 45, change: "-4.3%", trend: "down" },
    { sector: "Real Estate", sentiment: 52, change: "+0.8%", trend: "up" },
  ]

  const marketIndicators = [
    { name: "VIX (Volatility)", value: "18.5", change: "-2.3%", status: "low" },
    { name: "Put/Call Ratio", value: "0.85", change: "+5.1%", status: "neutral" },
    { name: "High-Low Index", value: "0.72", change: "+1.8%", status: "high" },
    { name: "Advance/Decline", value: "1.45", change: "+3.2%", status: "high" },
  ]

  const newsAnalysis = [
    {
      headline: "Fed Signals Dovish Stance on Interest Rates",
      sentiment: "Positive",
      impact: "High",
      relevance: 95,
      source: "Reuters",
      time: "2 hours ago",
    },
    {
      headline: "Tech Earnings Beat Expectations Across Sector",
      sentiment: "Positive",
      impact: "Medium",
      relevance: 88,
      source: "Bloomberg",
      time: "4 hours ago",
    },
    {
      headline: "Geopolitical Tensions Rise in Eastern Europe",
      sentiment: "Negative",
      impact: "Medium",
      relevance: 72,
      source: "Financial Times",
      time: "6 hours ago",
    },
    {
      headline: "Oil Prices Surge on Supply Chain Disruptions",
      sentiment: "Mixed",
      impact: "High",
      relevance: 85,
      source: "Wall Street Journal",
      time: "8 hours ago",
    },
  ]

  const aiInsights = [
    {
      type: "Market Opportunity",
      title: "Defensive Rotation Signal",
      description:
        "AI models detect increased institutional flow into defensive sectors. Consider utilities and consumer staples.",
      confidence: 87,
      timeframe: "1-2 weeks",
    },
    {
      type: "Risk Alert",
      title: "Correlation Spike Warning",
      description: "Cross-asset correlations reaching 6-month highs. Diversification benefits may be reduced.",
      confidence: 92,
      timeframe: "Immediate",
    },
    {
      type: "Technical Signal",
      title: "Support Level Test",
      description: "S&P 500 approaching key support at 4,200. Watch for potential bounce or breakdown.",
      confidence: 78,
      timeframe: "3-5 days",
    },
  ]

  const navigationItems = [
    { id: "dashboard", label: "Dashboard", icon: Home, onClick: () => navigate("/dashboard") },
    { id: "portfolio", label: "Portfolio", icon: Wallet, onClick: () => navigate("/portfolio") },
    { id: "chat", label: "AI Assistant", icon: MessageSquare, onClick: () => navigate("/chat") },
    { id: "goals", label: "Goals", icon: Target },
    { id: "analytics", label: "Analytics", icon: BarChart3, active: true },
    { id: "alerts", label: "Alerts", icon: Bell, onClick: () => navigate("/alerts") },
  ]

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 mb-8 px-6 pt-6">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
          <DollarSign className="h-5 w-5 text-primary-foreground" />
        </div>
        <span className="text-xl font-bold text-primary">FinRAG</span>
      </div>

      <nav className="space-y-2 px-6 flex-1">
        {navigationItems.map((item) => (
          <Button
            key={item.id}
            variant={activeTab === item.id ? "secondary" : "ghost"}
            className="w-full justify-start gap-3"
            onClick={() => {
              if (item.onClick) {
                item.onClick()
              } else {
                setActiveTab(item.id)
              }
              setIsMobileMenuOpen(false)
            }}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Button>
        ))}
      </nav>

      <div className="px-6 pb-6 space-y-2">
        <Button variant="ghost" className="w-full justify-start gap-3">
          <Settings className="h-4 w-4" />
          Settings
        </Button>
        <Button variant="ghost" className="w-full justify-start gap-3" onClick={handleLogout}>
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:left-0 lg:top-0 lg:h-full lg:w-64 lg:bg-card lg:border-r lg:border-border lg:block">
        <SidebarContent />
      </div>

      {/* Mobile Header */}
      <div className="lg:hidden bg-card border-b border-border p-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="lg:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-64 z-50">
              <SidebarContent />
            </SheetContent>
          </Sheet>
          
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-primary">FinRAG</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user?.avatar || "/placeholder.svg"} />
            <AvatarFallback>
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium hidden sm:block">{user?.name}</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:ml-64">
        <div className="hidden lg:flex items-center justify-between p-6 bg-card border-b border-border">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Market Analytics</h1>
            <p className="text-muted-foreground">AI-powered market sentiment and analysis</p>
          </div>
          <div className="flex items-center gap-4">
            <Button onClick={() => navigate("/chat")} size="sm">
              <MessageSquare className="h-4 w-4 mr-2" />
              Ask AI Assistant
            </Button>
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.avatar || "/placeholder.svg"} />
                <AvatarFallback>
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div className="text-right">
                <div className="text-sm font-medium">{user?.name}</div>
                <div className="text-xs text-muted-foreground">{user?.email}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 lg:p-6">
          {/* Mobile page title with actions */}
          <div className="lg:hidden mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
                <p className="text-muted-foreground">Market insights and sentiment</p>
              </div>
              <Button onClick={() => navigate("/chat")} size="sm">
                <MessageSquare className="h-4 w-4 mr-2" />
                AI
              </Button>
            </div>
          </div>

          {/* Market Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Market Sentiment</CardTitle>
                <Activity className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{marketSentiment.overall}%</div>
                <Badge variant="default" className="mt-2">
                  {marketSentiment.trend}
                </Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Fear & Greed Index</CardTitle>
                <Brain className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{marketSentiment.fearGreedIndex}</div>
                <Badge variant="secondary" className="mt-2">
                  Neutral
                </Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Market Change</CardTitle>
                <TrendingUp className="h-4 w-4 text-success" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-success">{marketSentiment.change}</div>
                <Badge variant="default" className="mt-2">
                  Today
                </Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">AI Confidence</CardTitle>
                <Zap className="h-4 w-4 text-purple-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">89%</div>
                <Badge variant="default" className="mt-2">
                  High
                </Badge>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="sentiment" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
              <TabsTrigger value="sentiment" className="text-xs sm:text-sm">Sentiment</TabsTrigger>
              <TabsTrigger value="indicators" className="text-xs sm:text-sm">Indicators</TabsTrigger>
              <TabsTrigger value="news" className="text-xs sm:text-sm">News</TabsTrigger>
              <TabsTrigger value="insights" className="text-xs sm:text-sm">AI Insights</TabsTrigger>
            </TabsList>

            <TabsContent value="sentiment" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Sector Sentiment Analysis</CardTitle>
                  <CardDescription>Real-time sentiment tracking across major sectors</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {sectorSentiment.map((sector, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{sector.sector}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">{sector.sentiment}%</span>
                            <div className="flex items-center gap-1">
                              {sector.trend === "up" ? (
                                <ArrowUp className="h-4 w-4 text-green-500" />
                              ) : (
                                <ArrowDown className="h-4 w-4 text-red-500" />
                              )}
                              <span className={`text-xs ${sector.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                                {sector.change}
                              </span>
                            </div>
                          </div>
                        </div>
                        <Progress
                          value={sector.sentiment}
                          className={`h-2 ${
                            sector.sentiment >= 70
                              ? "text-green-500"
                              : sector.sentiment >= 50
                                ? "text-yellow-500"
                                : "text-red-500"
                          }`}
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="indicators" className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Market Indicators</CardTitle>
                    <CardDescription>Key technical and sentiment indicators</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {marketIndicators.map((indicator, index) => (
                        <div key={index} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg border bg-card gap-2">
                          <div className="flex-1">
                            <div className="font-medium">{indicator.name}</div>
                            <div className="text-sm text-muted-foreground">
                              Status:{" "}
                              <span
                                className={
                                  indicator.status === "high"
                                    ? "text-green-600"
                                    : indicator.status === "low"
                                      ? "text-red-600"
                                      : "text-yellow-600"
                                }
                              >
                                {indicator.status.toUpperCase()}
                              </span>
                            </div>
                          </div>
                          <div className="text-left sm:text-right">
                            <div className="font-medium">{indicator.value}</div>
                            <div
                              className={`text-sm ${indicator.change.startsWith("+") ? "text-success" : "text-destructive"}`}
                            >
                              {indicator.change}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Market Health Score</CardTitle>
                    <CardDescription>Composite health indicator</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="text-center">
                        <div className="text-4xl font-bold text-green-600">B+</div>
                        <div className="text-sm text-muted-foreground">Overall Market Health</div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex justify-between">
                          <span className="text-sm">Liquidity</span>
                          <span className="text-sm font-medium">Good</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Volatility</span>
                          <span className="text-sm font-medium">Moderate</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Momentum</span>
                          <span className="text-sm font-medium">Strong</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Breadth</span>
                          <span className="text-sm font-medium">Healthy</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="news" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>News Sentiment Analysis</CardTitle>
                  <CardDescription>AI-powered analysis of market-moving news</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {newsAnalysis.map((news, index) => (
                      <div key={index} className="p-4 rounded-lg border bg-card">
                        <div className="space-y-3">
                          <h4 className="font-medium text-sm leading-relaxed">{news.headline}</h4>
                          <div className="flex flex-wrap items-center gap-2">
                            <Badge
                              variant={
                                news.sentiment === "Positive"
                                  ? "default"
                                  : news.sentiment === "Negative"
                                    ? "destructive"
                                    : "secondary"
                              }
                              className="text-xs"
                            >
                              {news.sentiment}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {news.impact} Impact
                            </Badge>
                            <div className="text-xs text-muted-foreground">Relevance: {news.relevance}%</div>
                          </div>
                          <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                            <span>{news.source}</span>
                            <span>{news.time}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="insights" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>AI Market Insights</CardTitle>
                  <CardDescription>Advanced AI analysis and predictions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {aiInsights.map((insight, index) => (
                      <div key={index} className="p-4 rounded-lg border bg-card">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant="outline" className="text-xs">
                                {insight.type}
                              </Badge>
                              <span className="text-xs text-muted-foreground">Confidence: {insight.confidence}%</span>
                            </div>
                            <h4 className="font-medium">{insight.title}</h4>
                            <p className="text-sm text-muted-foreground mt-1">{insight.description}</p>
                            <div className="text-xs text-muted-foreground mt-2">Timeframe: {insight.timeframe}</div>
                          </div>
                        </div>
                        <Progress value={insight.confidence} className="h-1 mt-3" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
