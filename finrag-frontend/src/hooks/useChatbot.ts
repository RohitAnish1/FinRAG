import { useState } from "react";
import * as chatbotApi from "../api/chatbot.api";

// Align the type with ChatMessage
type ChatMessage = {
  type: "user" | "ai"; // Changed from "role" to "type"
  text: string; // Changed from "content" to "text"
  data?: {
    sources?: any[];
    answer?: string;
    prediction?: "Up" | "Down";
    confidence?: number;
    news_summary?: string;
  };
};

export function useChatbot() {
  const [messages, setMessages] = useState<ChatMessage[]>([]); // Use ChatMessage type
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function sendMessage(query: string) {
    setLoading(true);

    const res = await chatbotApi.sendChatMessage(query);

    setConversationId(res.conversationId);

    setMessages((prev) => [
      ...prev,
      { type: "user", text: query }, // Updated to use "type" and "text"
      {
        type: "ai",
        text: res.answer,
        data: {
          answer: res.answer,      // <-- Put answer here!
      sources: res.sources,
        },
      },
    ]);

    setLoading(false);
  }

  async function loadConversation(id: string) {
    const history = await chatbotApi.fetchConversation(id);
    setConversationId(id);
    setMessages(
      history.map((msg: any) => ({
        type: msg.role, // Map "role" to "type"
        text: msg.content, // Map "content" to "text"
        data: msg.data,
      }))
    );
  }

  return {
    messages,
    loading,
    conversationId,
    sendMessage, // Renamed to match ChatbotPage
    loadConversation,
  };
}