"use client"

import { useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { Button } from "./ui/button"
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
} from "lucide-react"

export default function Sidebar() {
  const navigate = useNavigate()
  const { logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  const navigationItems = [
    { id: "dashboard", label: "Dashboard", icon: Home, onClick: () => navigate("/dashboard") },
    { id: "portfolio", label: "Portfolio", icon: Wallet, onClick: () => navigate("/portfolio") },
    { id: "chat", label: "AI Assistant", icon: MessageSquare, onClick: () => navigate("/chat") },
    { id: "goals", label: "Goals", icon: Target, onClick: () => navigate("/goals") },
    { id: "analytics", label: "Analytics", icon: BarChart3, onClick: () => navigate("/analytics") },
    { id: "alerts", label: "Alerts", icon: Bell, onClick: () => navigate("/alerts") },
  ]

  return (
    <div className="hidden md:fixed md:left-0 md:top-0 md:h-full md:w-64 md:bg-white md:border-r md:border-gray-200 md:block z-30">
      <div className="flex flex-col h-full">
        <div className="flex items-center gap-2 mb-8 px-6 pt-6">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <DollarSign className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold text-blue-600">FinRAG</span>
        </div>

        <nav className="space-y-2 px-6 flex-1">
          {navigationItems.map((item) => (
            <Button
              key={item.id}
              variant="ghost"
              className="w-full justify-start gap-3 hover:bg-gray-100 text-gray-700"
              onClick={item.onClick}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Button>
          ))}
        </nav>

        <div className="px-6 pb-6 space-y-2">
          <Button variant="ghost" className="w-full justify-start gap-3 hover:bg-gray-100 text-gray-700">
            <Settings className="h-4 w-4" />
            Settings
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-3 hover:bg-gray-100 text-gray-700" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  )
}
