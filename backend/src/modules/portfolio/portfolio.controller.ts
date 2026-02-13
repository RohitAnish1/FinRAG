import { Request, Response } from "express";
import {
  getPortfolioByUser,
  buyStock,
  sellStock,
  addCashToPortfolio
} from "./portfolio.service";

export async function getPortfolio(
  req: Request,
  res: Response
) {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const data = await getPortfolioByUser(req.user.id);
    res.json(data);
  } catch (err) {
    console.error("Error getting portfolio:", err);
    res.status(404).json({ message: "Portfolio not found" });
  }
}

export async function buy(
  req: Request,
  res: Response
) {
  const { symbol, shares, price, sector } = req.body;

  if (!symbol || !shares || !price) {
    return res.status(400).json({ message: "Missing fields" });
  }

  if (!req.user?.id) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    await buyStock(req.user.id, symbol, shares, price, sector);
    res.status(201).json({ message: "Stock bought" });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
}

export async function sell(
  req: Request,
  res: Response
) {
  const { symbol, shares, price } = req.body;

  if (!symbol || !shares || !price) {
    return res.status(400).json({ message: "Missing fields" });
  }

  if (!req.user?.id) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    await sellStock(req.user.id, symbol, shares, price);
    res.json({ message: "Stock sold" });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
}

export async function addCash(req: Request, res: Response) {
  if (!req.user?.id) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const userId = req.user.id;
  const { amount } = req.body;
  if (!amount || amount <= 0) return res.status(400).json({ message: "Invalid amount" });
  const result = await addCashToPortfolio(userId, amount);
  res.json({ cashBalance: result.cash_balance });
}