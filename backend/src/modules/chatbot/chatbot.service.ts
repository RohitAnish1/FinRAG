import { pool } from "../../config/db";
import axios from "axios";

const FASTAPI_BASE_URL = "http://localhost:8000";

/**
 * Create or reuse a conversation
 */
export async function CreateConversation(userId: string) {
  const res = await pool.query(
    `
    INSERT INTO ai_conversations (user_id)
    VALUES ($1)
    RETURNING id
    `,
    [userId]
  );

  return res.rows[0].id;
}

/**
 * Save a message
 */
export async function saveMessage(
  conversationId: string,
  role: "user" | "ai",
  content: string,
  sources: any[] = []
) {
  if (!content || !content.trim()) {
    throw new Error("Empty AI response");
  }

  await pool.query(
    `
    INSERT INTO ai_messages (conversation_id, role, content, sources)
    VALUES ($1, $2, $3, $4::jsonb)
    `,
    [conversationId, role, content, JSON.stringify(sources)]
  );
}


/**
 * Call FastAPI RAG service
 */
export async function queryFastAPI(query: string) {
  const res = await axios.post("http://localhost:8000/api/query", { query });
  return {
    answer: res.data.answer,   // <-- Make sure this is present
    sources: Array.isArray(res.data.sources) ? res.data.sources : []
  };
}



/**
 * Full chat interaction
 */
export async function handleChat(
  userId: string,
  query: string
) {
  const conversationId = await CreateConversation(userId);

  // Save user message
  await saveMessage(conversationId, "user", query);

  // Call AI
  const { answer, sources } = await queryFastAPI(query);

  // Save assistant message
  await saveMessage(conversationId, "ai", answer, sources);

  return {
    conversationId,
    answer,
    sources
  };
}

/**
 * Fetch conversation history
 */
export async function getConversationMessages(
  userId: string,
  conversationId: string
) {
  // ownership check
  const conv = await pool.query(
    `
    SELECT id
    FROM ai_conversations
    WHERE id = $1 AND user_id = $2
    `,
    [conversationId, userId]
  );

  if (conv.rowCount === 0) {
    throw new Error("Conversation not found");
  }

  const res = await pool.query(
    `
    SELECT role, content, sources, created_at
    FROM ai_messages
    WHERE conversation_id = $1
    ORDER BY created_at
    `,
    [conversationId]
  );

  return res.rows.map(r => ({
    role: r.role,
    content: r.content,
    sources: r.sources
  }));
}
