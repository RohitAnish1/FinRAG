import { apiClient } from "./client";

export async function sendChatMessage(query: string) {
  const res = await apiClient.post("/chatbot/query", { query });
  return res.data as {
    conversationId: string;
    answer: string;
    sources: any[];
  };
}

export async function fetchConversation(conversationId: string) {
  const res = await apiClient.get(
    `/chatbot/conversations/${conversationId}`
  );
  return res.data;
}
