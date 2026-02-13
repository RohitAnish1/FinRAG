import express from "express";
import cors from "cors";

import authRoutes from "./modules/auth/auth.routes";
import portfolioRoutes from "./modules/portfolio/portfolio.routes";
import goalsRoutes from "./modules/goals/goals.routes";
import analyticsRoutes from "./modules/analytics/analytics.routes";
import alertsRoutes from "./modules/alerts/alerts.routes";
import chatbotRoutes from "./modules/chatbot/chatbot.routes";
import marketRoutes from "./modules/market/market.routes"

import { errorHandler } from "./middleware/errorHandler";

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/portfolio", portfolioRoutes);
app.use("/api/goals", goalsRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/alerts", alertsRoutes);
app.use("/api/chatbot", chatbotRoutes);
app.use("/api/market",marketRoutes);

app.get("/health", (_, res) => {
  res.json({ status: "ok" });
});


app.use(errorHandler);

export default app;
