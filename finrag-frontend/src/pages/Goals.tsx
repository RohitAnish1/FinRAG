"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Badge } from "../components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import { Sheet, SheetContent, SheetTrigger } from "../components/ui/sheet"
import { Progress } from "../components/ui/progress"
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
  Menu,
  User,
  Plus,
  Calendar,
  TrendingUp,
} from "lucide-react"
import type { User as SupabaseUser } from '@supabase/supabase-js'

export interface ExtendedUser extends SupabaseUser {
  avatar?: string
  name?: string
}

const mapUser = (supabaseUser: SupabaseUser | null): ExtendedUser | null => {
  if (!supabaseUser) return null;
  
  return {
    ...supabaseUser,
    avatar: supabaseUser.user_metadata?.avatar_url,
    name: supabaseUser.user_metadata?.full_name || supabaseUser.email?.split('@')[0]
  }
}

export default function Goals() {
  const navigate = useNavigate()
  const { user: authUser, logout } = useAuth()
  const [activeTab, setActiveTab] = useState("goals")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const user = mapUser(authUser)

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  const goals = [
    {
      id: 1,
      title: "Emergency Fund",
      target: 50000,
      current: 32500,
      progress: 65,
      deadline: "2024-12-31",
      category: "Safety",
      status: "on-track"
    },
    {
      id: 2,
      title: "Retirement Savings",
      target: 1000000,
      current: 245000,
      progress: 24.5,
      deadline: "2045-01-01",
      category: "Retirement",
      status: "on-track"
    },
    {
      id: 3,
      title: "House Down Payment",
      target: 100000,
      current: 45000,
      progress: 45,
      deadline: "2025-06-30",
      category: "Major Purchase",
      status: "behind"
    },
    {
      id: 4,
      title: "Vacation Fund",
      target: 15000,
      current: 8500,
      progress: 56.7,
      deadline: "2024-07-01",
      category: "Lifestyle",
      status: "ahead"
    }
  ]

  const navigationItems = [
    { id: "dashboard", label: "Dashboard", icon: Home, onClick: () => navigate("/dashboard") },
    { id: "portfolio", label: "Portfolio", icon: Wallet, onClick: () => navigate("/portfolio") },
    { id: "chat", label: "AI Assistant", icon: MessageSquare, onClick: () => navigate("/chat") },
    { id: "goals", label: "Goals", icon: Target, active: true },
    { id: "analytics", label: "Analytics", icon: BarChart3, onClick: () => navigate("/analytics") },
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
            <h1 className="text-2xl font-bold text-foreground">Financial Goals</h1>
            <p className="text-muted-foreground">Track and manage your financial objectives</p>
          </div>
          <div className="flex items-center gap-4">
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Goal
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
          {/* Mobile page title */}
          <div className="lg:hidden mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Goals</h1>
              <p className="text-muted-foreground">Financial objectives</p>
            </div>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add
            </Button>
          </div>

          {/* Goals Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Goals</CardTitle>
                <Target className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{goals.length}</div>
                <Badge variant="default" className="mt-2">
                  Active
                </Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">On Track</CardTitle>
                <TrendingUp className="h-4 w-4 text-success" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3</div>
                <Badge variant="default" className="mt-2">
                  Progress
                </Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Target</CardTitle>
                <DollarSign className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$1.17M</div>
                <Badge variant="secondary" className="mt-2">
                  Combined
                </Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Saved So Far</CardTitle>
                <Wallet className="h-4 w-4 text-success" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$331K</div>
                <Badge variant="default" className="mt-2">
                  28.3%
                </Badge>
              </CardContent>
            </Card>
          </div>

          {/* Goals List */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {goals.map((goal) => (
              <Card key={goal.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{goal.title}</CardTitle>
                      <CardDescription>{goal.category}</CardDescription>
                    </div>
                    <Badge 
                      variant={
                        goal.status === 'on-track' ? 'default' :
                        goal.status === 'ahead' ? 'default' : 'destructive'
                      }
                    >
                      {goal.status === 'on-track' ? 'On Track' :
                       goal.status === 'ahead' ? 'Ahead' : 'Behind'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{goal.progress.toFixed(1)}%</span>
                    </div>
                    <Progress value={goal.progress} className="h-2" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground">Current</div>
                      <div className="font-medium">${goal.current.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Target</div>
                      <div className="font-medium">${goal.target.toLocaleString()}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Due: {new Date(goal.deadline).toLocaleDateString()}</span>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      Edit Goal
                    </Button>
                    <Button size="sm" className="flex-1">
                      Add Funds
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
