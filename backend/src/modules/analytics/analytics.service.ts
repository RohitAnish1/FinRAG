import { pool } from "../../config/db"
import dayjs from "dayjs"

/* ---------- Types ---------- */

type PortfolioRow = {
  id: string
  cash_balance: number
}

type HoldingRow = {
  symbol: string
  shares: number
  avg_cost: number
  sector: string | null
}

type GoalRow = {
  title: string
  target_amount: number
  current_amount: number
  deadline: string | null
  status: "on-track" | "behind"
}

/* ---------- Service ---------- */

export const buildAnalytics = async (userId: string) => {
  /* ---------- Portfolio ---------- */
  const portfolioRes = await pool.query<PortfolioRow>(
    `SELECT id, cash_balance
     FROM portfolios
     WHERE user_id = $1`,
    [userId]
  )

  if (portfolioRes.rowCount === 0) {
  return {
    portfolio: {
      totalValue: 0,
      cashBalance: 0,
      investedValue: 0,
      cashRatio: 0,
      allocationBySymbol: {},
      allocationBySector: {},
      concentrationRisk: 0,
      diversificationScore: "Low"
    },
    goals: []
  }
}

  const portfolio = portfolioRes.rows[0]

  const holdingsRes = await pool.query<HoldingRow>(
    `SELECT symbol, shares, avg_cost, sector
     FROM holdings
     WHERE portfolio_id = $1`,
    [portfolio.id]
  )

  let investedValue = 0
  const allocationBySymbol: Record<string, number> = {}
  const allocationBySector: Record<string, number> = {}

  for (const h of holdingsRes.rows) {
    const value = Number(h.shares) * Number(h.avg_cost)
    investedValue += value

    allocationBySymbol[h.symbol] =
      (allocationBySymbol[h.symbol] || 0) + value

    const sector = h.sector ?? "Uncategorized"
    allocationBySector[sector] =
      (allocationBySector[sector] || 0) + value
  }

  const cashBalance = Number(portfolio.cash_balance)
  const totalValue = cashBalance + investedValue

  const topHoldingValue =
    Math.max(0, ...Object.values(allocationBySymbol))

  const concentrationRisk =
    totalValue > 0 ? (topHoldingValue / totalValue) * 100 : 0

  const diversificationScore =
    Object.keys(allocationBySymbol).length >= 5
      ? "High"
      : Object.keys(allocationBySymbol).length >= 3
      ? "Medium"
      : "Low"

  /* ---------- Goals ---------- */
  const goalsRes = await pool.query<GoalRow>(
    `SELECT title, target_amount, current_amount, deadline, status
     FROM goals
     WHERE user_id = $1`,
    [userId]
  )

  const goals = goalsRes.rows.map((g) => {
    const completion =
      (Number(g.current_amount) / Number(g.target_amount)) * 100

    let monthsRemaining: number | null = null
    let requiredMonthly: number | null = null

    if (g.deadline) {
      monthsRemaining = dayjs(g.deadline).diff(dayjs(), "month")
      if (monthsRemaining > 0) {
        requiredMonthly =
          (Number(g.target_amount) - Number(g.current_amount)) /
          monthsRemaining
      }
    }

    return {
      title: g.title,
      status: g.status,
      completion: Number(completion.toFixed(2)),
      monthsRemaining,
      requiredMonthly
    }
  })

  return {
    totalValue: Number(totalValue.toFixed(2)),
    cashBalance: Number(cashBalance.toFixed(2)),
    investedValue: Number(investedValue.toFixed(2)),
    cashRatio: totalValue > 0 ? Number(((cashBalance / totalValue) * 100).toFixed(2)) : 0,
    allocationBySymbol,
    allocationBySector,
    concentrationRisk: Number(concentrationRisk.toFixed(2)),
    diversificationScore,
    goals
  }
}