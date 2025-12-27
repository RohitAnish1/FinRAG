"use client"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet"
import { Button } from "./ui/button"
import { Avatar, AvatarFallback } from "./ui/avatar"
import {
  Menu,
  User,
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

export default function MobileHeader({ showSidebarButton }: { showSidebarButton?: boolean }) {
  const [open, setOpen] = useState(false)
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

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white">
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
            onClick={() => {
              item.onClick()
              setOpen(false)
            }}
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
        <Button variant="ghost" className="w-full justify-start gap-3 hover:bg-gray-100 text-gray-700" onClick={() => {
          handleLogout()
          setOpen(false)
        }}>
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  )

  return (
    <div className="md:hidden flex items-center justify-between px-4 py-3 border-b bg-white sticky top-0 z-50 shadow-sm">
      <div className="flex items-center gap-3">
        {showSidebarButton && (
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-64 z-[100]">
              <SidebarContent />
            </SheetContent>
          </Sheet>
        )}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <DollarSign className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold text-blue-600">FinRAG</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Avatar className="h-8 w-8">
          <AvatarFallback>
            <User className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      </div>
    </div>
  )
}
