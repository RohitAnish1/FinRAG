"use client"

import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { useAuth } from "../contexts/AuthContext"
import MobileHeader from "../components/MobileHeader"
import Sidebar from "../components/Sidebar"

// Shadcn UI Components
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Badge } from "../components/ui/badge"
import { Avatar, AvatarFallback} from "../components/ui/avatar"
import { Sheet, SheetContent, SheetTrigger } from "../components/ui/sheet"
import { Input } from "../components/ui/input"
import { Progress } from "../components/ui/progress"

// Lucide React Icons
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
  Bot,
  TrendingUp,
  TrendingDown,
  Send,
} from "lucide-react"

// --- Type Definitions ---
interface AiData {
  answer?: string
  sources?: string[]
  prediction?: "Up" | "Down"
  confidence?: number
  news_summary?: string
}

interface ChatMessage {
  type: "user" | "ai"
  text?: string // For user messages
  data?: AiData // For AI messages
}

// --- Helper Component for Rendering Different AI Answer Types ---
const AiAnswer = ({ data }: { data: AiData }) => {
  // 1. Prediction Card
  if (data.prediction) {
    const isUp = data.prediction === "Up"
    return (
      <Card className="bg-background/50 border-border">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            {isUp ? (
              <TrendingUp className="h-5 w-5 text-success" />
            ) : (
              <TrendingDown className="h-5 w-5 text-destructive" />
            )}
            <span>Model Forecast:</span>
            <span className={`font-bold ${isUp ? "text-success" : "text-destructive"}`}>{data.prediction}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3 text-sm mb-4">
            <span className="font-medium text-muted-foreground">Confidence</span>
            <Progress value={data.confidence ?? 0} className="w-[50%]" />
            <span className="font-bold">{data.confidence?.toFixed(1)}%</span>
          </div>
          <p className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">{data.news_summary}</p>
        </CardContent>
      </Card>
    )
  }

  // 2. Analytical Card (e.g., top gainers/losers)
  if (typeof data.answer === "string" && (data.answer?.includes("Gained") || data.answer?.includes("Lost"))) {
    const lines = data.answer.split("\n")
    const title = lines[0]
    const stocks = lines.slice(1)
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-foreground">{title}</h3>
        </div>
        <ul className="space-y-2 pl-2">
          {stocks.map((stock: string, index: number) => (
            <li
              key={index}
              className="flex items-center justify-between text-sm bg-muted/50 p-2 rounded-md font-medium"
            >
              <span>{stock}</span>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  // 3. Default Text Answer
  return <p className="text-foreground whitespace-pre-line leading-relaxed">{data.answer}</p>
}

export default function ChatPage() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const [query, setQuery] = useState("")
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      type: "ai",
      data: {
        answer:
          "Hello! I'm your AI Financial Advisor for FinRAG. I can forecast stock movements, analyze market performance, and answer questions based on the latest news. What would you like to know?",
      },
    },
  ])
  const [loading, setLoading] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)

  const quickQuestions = [
    "What is the forecast for Reliance stock?",
    "Which NIFTY stocks have the best performance recently under ₹1500?",
    "What are the trending stocks today?",
    "What is an RSI indicator?",
  ]

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [chatHistory])

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  const handleSubmit = async (prompt: string) => {
    if (!prompt.trim()) return

    const userQuery: ChatMessage = { type: "user", text: prompt }
    setChatHistory((prev) => [...prev, userQuery])
    setQuery("") // Clear input field
    setLoading(true)

    try {
      const res = await fetch("http://localhost:8000/api/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: prompt }),
      })

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)

      const data: AiData = await res.json()
      const aiResponse: ChatMessage = { type: "ai", data }
      setChatHistory((prev) => [...prev, aiResponse])
    } catch (err) {
      console.error("API call failed:", err)
      const errorResponse: ChatMessage = {
        type: "ai",
        data: { answer: "Sorry, I'm having trouble connecting. Please check the console or try again later." },
      }
      setChatHistory((prev) => [...prev, errorResponse])
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header (visible on phones) */}
      <MobileHeader showSidebarButton />

      {/* Desktop Sidebar (visible on large screens) */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="md:ml-64 flex flex-col" style={{ height: "100vh" }}>
        {/* Desktop Header for Main Content */}
        <div className="hidden md:flex items-center justify-between p-6 bg-white border-b border-gray-200">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">AI Assistant</h1>
            <p className="text-gray-600">Ask questions about markets, stocks, and your portfolio.</p>
          </div>
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
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
          {chatHistory.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex items-start gap-4 ${message.type === "user" ? "justify-end" : ""}`}
            >
              {message.type === "ai" && (
                <Avatar className="h-9 w-9 flex-shrink-0">
                  <AvatarFallback className="bg-blue-600 text-white">
                    <Bot size={20} />
                  </AvatarFallback>
                </Avatar>
              )}

              <div
                className={`max-w-xl rounded-lg px-4 py-3 ${
                  message.type === "user"
                    ? "bg-blue-600 text-white rounded-br-none"
                    : "bg-white border border-gray-200 rounded-bl-none"
                }`}
              >
                {message.type === "user" ? (
                  <p>{message.text}</p>
                ) : (
                  <div className="space-y-4">
                    <AiAnswer data={message.data ?? {}} />
                    {message.data?.sources && message.data.sources.length > 0 && (
                      <div className="pt-3 border-t border-gray-200">
                        <h4 className="font-semibold text-xs text-gray-600 mb-2">Sources:</h4>
                        <div className="flex flex-wrap gap-2">
                          {message.data?.sources.map((source, i) => {
  let hostname = `Source ${i + 1}`;
  try {
    hostname = new URL(source).hostname;
  } catch (err) {
    console.error(`Invalid URL: ${source}`, err);
  }
  return (
    <a
      href={source}
      target="_blank"
      rel="noopener noreferrer"
      key={i}
      className="text-xs"
    >
      <Badge variant="outline">{hostname}</Badge>
    </a>
  );
})}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {message.type === "user" && (
                <Avatar className="h-9 w-9 flex-shrink-0">
                  <AvatarFallback>
                    <User size={20} />
                  </AvatarFallback>
                </Avatar>
              )}
            </motion.div>
          ))}
          <div ref={chatEndRef} />
        </div>

        {/* Query Input Area */}
        <div className="p-4 md:p-6 bg-white border-t border-gray-200">
          <div className="mb-3 flex flex-wrap gap-2">
            {quickQuestions.map((q) => (
              <Button
                key={q}
                size="sm"
                variant="outline"
                onClick={() => handleSubmit(q)}
                className="text-xs flex-shrink-0"
                disabled={loading}
              >
                {q}
              </Button>
            ))}
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSubmit(query)
            }}
            className="relative"
          >
            <Input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask a financial question..."
              className="pr-12 h-11"
              disabled={loading}
            />
            <Button
              type="submit"
              size="icon"
              disabled={loading || !query.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
            >
              <Send size={18} />
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}