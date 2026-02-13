import { Request, Response } from "express"
import { searchStocks, addStockToPortfolio } from "./market.service"


export async function searchStocksController(req: Request, res: Response) {
  const query = req.query.query as string

  if (!query) {
    return res.status(400).json({ error: "Query parameter is required" })
  }

  try {
    const stocks = await searchStocks(query)
    return res.status(200).json(stocks)
  } catch (error) {
    console.error("Error searching stocks:", error)
    return res.status(500).json({ error: "Failed to fetch stocks" })
  }
}


export async function addStockToPortfolioController(req: Request, res: Response) {
  const { symbol, currentPrice } = req.body

  if (!symbol || currentPrice == null) {
    return res.status(400).json({
      error: "Symbol and current price are required",
    })
  }

  try {
    await addStockToPortfolio({ symbol, currentPrice })
    return res.status(200).json({ message: "Stock added to portfolio" })
  } catch (error) {
    console.error("Error adding stock to portfolio:", error)
    return res.status(500).json({ error: "Failed to add stock to portfolio" })
  }
}
