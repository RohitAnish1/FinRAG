import { apiClient } from "./client";

export async function fetchPortfolio() {
  const res = await apiClient.get("/portfolio");
  return res.data;
}

export async function buyStock(payload: {
  symbol: string;
  shares: number;
  price: number;
  sector?: string;
}) {
  const res = await apiClient.post("/portfolio/buy", payload);
  return res.data;
}

export async function sellStock(payload: {
  symbol: string;
  shares: number;
  price: number;
}) {
  const res = await apiClient.post("/portfolio/sell", payload);
  return res.data;
}

export async function addCash(amount: number) {
  const res = await apiClient.post("/portfolio/add-cash", { amount });
  return res.data;
}