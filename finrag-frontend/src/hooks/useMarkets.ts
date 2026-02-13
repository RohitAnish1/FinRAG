import { useState } from "react"
import * as marketsApi from "../api/markets.api"
import { buyStock } from "../api/portfolio.api" // <-- Import buyStock

export function useMarkets() {
  const [stocks, setStocks] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function searchStocks(query: string) {
    setLoading(true)
    setError(null)
    try {
      const data = await marketsApi.searchStocks(query)
      setStocks(data)
    } catch (err: any) {
      setError(err?.message || "Failed to fetch stocks")
    } finally {
      setLoading(false)
    }
  }

  async function addToPortfolio(stock: any) {
    try {
      await buyStock({
        symbol: stock.symbol,
        shares: 1, // or prompt user for input
        price: stock.currentPrice,
        sector: stock.sector, // if available
      })
      alert("Stock added to portfolio!")
    } catch (err: any) {
      setError(err?.message || "Failed to add stock to portfolio")
    }
  }

  return {
    stocks,
    loading,
    error,
    searchStocks,
    addToPortfolio,
  }
}