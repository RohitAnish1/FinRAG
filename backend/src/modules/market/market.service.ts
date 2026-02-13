import axios from "axios"
import { addStock } from "../portfolio/portfolio.service"

export async function searchStocks(query: string) {
  const symbols = query.split(",").map((s) => s.trim())
  const response = await axios.post("http://localhost:8000/api/prices", { symbols })
  return response.data
}

export async function addStockToPortfolio(stock: { symbol: string; currentPrice: number }) {
  await addStock(stock.symbol, stock.currentPrice)
}