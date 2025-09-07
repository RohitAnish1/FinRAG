import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Home, MessageSquare, Briefcase, BarChart2, Bell, Bot, User, ArrowUp, ArrowDown, TrendingUp, Copy, Search, Send } from 'lucide-react';

// --- Helper Component for Rendering Different Answer Types ---
interface AiData {
  answer?: string;
  sources?: string[];
  prediction?: 'Up' | 'Down';
  confidence?: number;
  news_summary?: string;
}

const AiAnswer = ({ data }: { data: AiData }) => {
    // Check for a prediction response
    if (data.prediction) {
        const isUp = data.prediction === 'Up';
        return (
            <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                <div className="flex items-center mb-2">
                    {isUp ? <ArrowUp className="text-green-500 mr-2" size={20} /> : <ArrowDown className="text-red-500 mr-2" size={20} />}
                    <span className="font-bold text-lg text-gray-800">Model Forecast: </span>
                    <span className={`ml-2 font-semibold text-lg ${isUp ? 'text-green-600' : 'text-red-600'}`}>
                        {data.prediction}
                    </span>
                </div>
                <div className="flex items-center text-gray-600 mb-4">
                    <span className="font-medium">Confidence:</span>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 ml-2">
                        <div className={`h-2.5 rounded-full ${isUp ? 'bg-green-500' : 'bg-red-500'}`} style={{ width: `${data.confidence}%` }}></div>
                    </div>
                    <span className="ml-2 font-bold text-sm">{data.confidence !== undefined ? data.confidence.toFixed(1) : "N/A"}%</span>
                </div>
                <p className="text-gray-700 whitespace-pre-line leading-relaxed">{data.news_summary}</p>
            </div>
        );
    }

    // Check for an analytical response (heuristic check)
    if (typeof data.answer === 'string' && (data.answer?.includes("Gained") || data.answer?.includes("Lost"))) {
        const lines = data.answer.split('\n');
        const title = lines[0];
        const stocks = lines.slice(1);
        return (
             <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                <div className="flex items-center mb-3">
                    <TrendingUp className="text-blue-600 mr-2" size={20} />
                    <h3 className="font-bold text-lg text-gray-800">{title}</h3>
                </div>
                <ul className="space-y-2">
                    {stocks.map((stock: string, index: number) => (
                      <li key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded-md">
                        <span className="font-medium text-gray-700">{stock}</span>
                      </li>
                    ))}
                </ul>
            </div>
        )
    }

    // Default: Render standard text answer
    return <p className="text-gray-800 whitespace-pre-line leading-relaxed">{data.answer}</p>;
};


export default function ChatbotPage() {
    const [query, setQuery] = useState("");
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
        {
            type: 'ai',
            data: { 
                answer: "Hello! I'm your AI Financial Advisor. I can forecast stock movements, analyze market performance, and answer questions based on the latest news. What would you like to know?",
                sources: []
            }
        }
    ]);
    const [loading, setLoading] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);

    const quickQuestions = [
        "What is the forecast for Reliance stock?",
        "Which NIFTY stocks have the best performance recently under ₹1500?",
        "What are the trending stocks today?",
        "What is an RSI indicator?",
    ];

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chatHistory]);

    interface ChatMessage {
      type: 'user' | 'ai';
      data?: AiData;
      text?: string;
    }

    interface AiData {
      answer?: string;
      sources?: string[];
      prediction?: 'Up' | 'Down';
      confidence?: number;
      news_summary?: string;
    }

    interface HandleSubmitEvent {
      preventDefault: () => void;
      target: { value: string };
    }

    const handleSubmit = async (e: HandleSubmitEvent): Promise<void> => {
      e.preventDefault();
      if (!query.trim()) return;

      const userQuery: ChatMessage = { type: 'user', data: { answer: query, sources: [] } };
      setChatHistory((prev: ChatMessage[]) => [...prev, userQuery]);
      setQuery("");
      setLoading(true);

      try {
        const res = await fetch("http://localhost:8000/api/query", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query }),
        });
        const data: AiData = await res.json();
        const aiResponse: ChatMessage = { type: 'ai', data: data || { answer: "No answer returned.", sources: [] } };
        setChatHistory((prev: ChatMessage[]) => [...prev, aiResponse]);
      } catch (err) {
        const errorResponse: ChatMessage = { type: 'ai', data: { answer: "Sorry, I'm having trouble connecting to the server. Please try again later.", sources: [] } };
        setChatHistory((prev: ChatMessage[]) => [...prev, errorResponse]);
      }
      setLoading(false);
    };

    return (
        <div className="flex h-screen bg-gray-50 font-sans">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 flex flex-col p-4 fixed h-full">
                <div className="flex items-center mb-8 px-2">
                    <MessageSquare className="text-blue-600 mr-2" size={28} />
                    <span className="font-extrabold text-2xl text-gray-800">FinRAG</span>
                </div>
                <nav className="flex flex-col gap-2">
                    {[
                        { label: "Dashboard", icon: Home },
                        { label: "Chat", icon: MessageSquare, active: true },
                        { label: "Portfolio", icon: Briefcase },
                        { label: "Market", icon: BarChart2 },
                        { label: "Alerts", icon: Bell },
                    ].map((item) => (
                        <button key={item.label} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm font-semibold ${item.active ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-100"}`}>
                            <item.icon size={20} />
                            {item.label}
                        </button>
                    ))}
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64 flex flex-col h-screen">
                <header className="flex items-center justify-between p-6 border-b border-gray-200 bg-white">
                    <div>
                        <h1 className="font-bold text-xl text-gray-900">AI Financial Chat</h1>
                        <p className="text-gray-500 text-sm">Get personalized investment advice and market insights</p>
                    </div>
                </header>
                
                {/* Chat History */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {chatHistory.map((message, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex items-start gap-4 ${message.type === 'user' ? 'justify-end' : ''}`}
                        >
                            {message.type === 'ai' && (
                                <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0">
                                    <Bot size={24} />
                                </div>
                            )}
                            <div className={`max-w-xl p-4 rounded-2xl ${message.type === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white border border-gray-200 rounded-bl-none'}`}>
                                {message.type === 'user' ? (
                                    <p>{message.text}</p>
                                ) : (
                                    <div className="space-y-4">
                                        <AiAnswer data={message.data ?? { answer: "", sources: [] }} />
                                        {message.data && message.data.sources && message.data.sources.length > 0 && (
                                            <div className="pt-3 border-t border-gray-200">
                                                <h4 className="font-semibold text-xs text-gray-500 mb-2">Sources:</h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {message.data.sources.map((source, i) => (
                                                        <a href={source} target="_blank" rel="noopener noreferrer" key={i} className="text-xs bg-gray-100 text-blue-700 px-2 py-1 rounded-md hover:bg-blue-100 transition-colors">
                                                            {source.replace('Internal Market Analysis', 'Internal Analysis') || `Source ${i+1}`}
                                                        </a>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                            {message.type === 'user' && (
                                <div className="w-10 h-10 rounded-full bg-gray-700 text-white flex items-center justify-center flex-shrink-0">
                                    <User size={24} />
                                </div>
                            )}
                        </motion.div>
                    ))}
                    <div ref={chatEndRef} />
                </div>

                {/* Query Input */}
                <div className="p-6 bg-white border-t border-gray-200">
                    <div className="grid gap-2 mb-3">
                        <div className="flex flex-wrap gap-2">
                            {quickQuestions.map((q) => (
                                <button key={q} onClick={() => handleSubmit({ preventDefault: () => {}, target: { value: q }})} className="px-3 py-1.5 bg-gray-100 border border-gray-200 rounded-full text-xs font-medium text-gray-700 hover:bg-blue-50 hover:border-blue-300 transition-all">
                                    {q}
                                </button>
                            ))}
                        </div>
                    </div>
                    <form onSubmit={(e) => { e.preventDefault(); handleSubmit({ preventDefault: () => {}, target: { value: query }}); }} className="relative">
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Ask a financial question..."
                            className="w-full pl-4 pr-12 py-3 text-sm text-gray-800 bg-gray-100 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                            disabled={loading}
                        />
                        <button type="submit" disabled={loading || !query.trim()} className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 text-white rounded-md p-2 hover:bg-blue-700 transition-all disabled:bg-blue-300 disabled:cursor-not-allowed">
                            <Send size={18} />
                        </button>
                    </form>
                </div>
            </main>
        </div>
    );
}