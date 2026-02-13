import { apiClient } from "./client"

export async function searchStocks(query: string) {
  const res = await apiClient.get(`/market/search?query=${query}`)
  return res.data
}

export async function addStockToPortfolio(stock: { symbol: string; currentPrice: number }) {
  const res = await apiClient.post("/portfolio/add", stock)
  return res.data
}