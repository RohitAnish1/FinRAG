import { Request, Response } from "express";
import {
  handleChat,
  getConversationMessages
} from "./chatbot.service";

export async function chat(
  req: Request,
  res: Response
) {
  const { query } = req.body;

  if (!query) {
    return res.status(400).json({ message: "Query is required" });
  }

  if (!req.user?.id) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const result = await handleChat(req.user.id, query);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.json({
      answer: "The AI responded, but the message could not be saved.",
      sources: []
    });
  }
}

export async function history(
  req: Request,
  res: Response
) {
  const { conversationId } = req.params;

  if (!req.user?.id) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const messages = await getConversationMessages(
      req.user.id,
      conversationId
    );
    res.json(messages);
  } catch (err: any) {
    res.status(404).json({ message: err.message });
  }
}