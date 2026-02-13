"use client";

import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../hooks/useAuth"
import { useChatbot } from "../hooks/useChatbot";
import MobileHeader from "../components/MobileHeader";
import Sidebar from "../components/Sidebar";

// UI
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { Input } from "../components/ui/input";
import { Progress } from "../components/ui/progress";

// Icons
import { BarChart3, User, Bot, TrendingUp, TrendingDown, Send } from "lucide-react";

// ---------------- Types ----------------

interface AiData {
  answer?: string;
  sources?: string[];
  prediction?: "Up" | "Down";
  confidence?: number;
  news_summary?: string;
}

interface ChatMessage {
  type: "user" | "ai";
  text?: string;
  data?: AiData;
}

// ---------------- AI Answer Renderer ----------------

const AiAnswer = ({ data }: { data: AiData }) => {
  if (data.prediction) {
    const isUp = data.prediction === "Up";
    return (
      <Card className="bg-background/50 border-border">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            {isUp ? (
              <TrendingUp className="h-5 w-5 text-success" />
            ) : (
              <TrendingDown className="h-5 w-5 text-destructive" />
            )}
            Model Forecast:
            <span className={`font-bold ${isUp ? "text-success" : "text-destructive"}`}>
              {data.prediction}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3 text-sm mb-4">
            <span className="text-muted-foreground">Confidence</span>
            <Progress value={data.confidence ?? 0} className="w-[50%]" />
            <span className="font-bold">{data.confidence?.toFixed(1)}%</span>
          </div>
          <p className="text-sm text-muted-foreground whitespace-pre-line">{data.news_summary}</p>
        </CardContent>
      </Card>
    );
  }

  return <p className="whitespace-pre-line">{data.answer}</p>;
};

// ---------------- Page ----------------

export default function ChatbotPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { messages, loading, sendMessage } = useChatbot();

  const [query, setQuery] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  const quickQuestions = [
    "What is the forecast for Reliance stock?",
    "Which NIFTY stocks performed best recently?",
    "What are the trending stocks today?",
    "Explain RSI indicator",
  ];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (prompt: string) => {
    if (!prompt.trim()) return;
    setQuery("");
    await sendMessage(prompt);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <MobileHeader showSidebarButton />
      <Sidebar />

      <div className="md:ml-64 flex flex-col h-screen">
        {/* Header */}
        <div className="hidden md:flex items-center justify-between p-6 bg-white border-b">
          <div>
            <h1 className="text-2xl font-bold">AI Assistant</h1>
            <p className="text-gray-600">Ask questions about markets and finance</p>
          </div>
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback>
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <span className="text-xs text-gray-500">{user?.email}</span>
          </div>
        </div>

        {/* Chat */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {messages.map((message: ChatMessage, index: number) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-4 ${message.type === "user" ? "justify-end" : ""}`}
            >
              {message.type === "ai" && (
                <Avatar>
                  <AvatarFallback className="bg-blue-600 text-white">
                    <Bot size={18} />
                  </AvatarFallback>
                </Avatar>
              )}

              <div
                className={`max-w-xl px-4 py-3 rounded-lg ${
                  message.type === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-white border"
                }`}
              >
                {message.type === "user" ? (
                  <p>{message.text}</p>
                ) : (
                  <AiAnswer data={message.data ?? {}} />
                )}

                {message.data?.sources?.length ? (
                  <div className="pt-3 mt-3 border-t text-xs">
                    <div className="flex flex-wrap gap-2">
                      {message.data.sources.map((src, i) => (
                        <a key={i} href={src} target="_blank" rel="noreferrer">
                          <Badge variant="outline">Source {i + 1}</Badge>
                        </a>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>

              {message.type === "user" && (
                <Avatar>
                  <AvatarFallback>
                    <User size={18} />
                  </AvatarFallback>
                </Avatar>
              )}
            </motion.div>
          ))}
          <div ref={chatEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 bg-white border-t">
          <div className="mb-3 flex flex-wrap gap-2">
            {quickQuestions.map((q) => (
              <Button
                key={q}
                size="sm"
                variant="outline"
                disabled={loading}
                onClick={() => handleSubmit(q)}
              >
                {q}
              </Button>
            ))}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit(query);
            }}
            className="relative"
          >
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask a financial question..."
              disabled={loading}
              className="pr-12"
            />
            <Button
              type="submit"
              size="icon"
              disabled={loading || !query.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2"
            >
              <Send size={16} />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}