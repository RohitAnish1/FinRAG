import { pool } from '../../config/db';

export async function getPortfolioByUser(userId: string) {
  let portfolioRes = await pool.query(
    `
    SELECT id, cash_balance, created_at
    FROM portfolios
    WHERE user_id = $1
    `,
    [userId]
  );

  if (portfolioRes.rowCount === 0) {
    // Lazy create portfolio with default paper money
    portfolioRes = await pool.query(
      `
      INSERT INTO portfolios (user_id, cash_balance)
      VALUES ($1, 100000)
      RETURNING id, cash_balance, created_at
      `,
      [userId]
    );
  }

  const portfolio = portfolioRes.rows[0];

  const holdingsRes = await pool.query(
    `
    SELECT symbol, shares, avg_cost, sector
    FROM holdings
    WHERE portfolio_id = $1
    `,
    [portfolio.id]
  );

    const holdings = holdingsRes.rows.map((h) => {
    const shares = Number(h.shares);
    const avgCost = Number(h.avg_cost);
    const currentValue = shares * avgCost;
    const costBasis = shares * avgCost;
    const gainLoss = currentValue - costBasis;
    const gainLossPct = costBasis > 0 ? (gainLoss / costBasis) * 100 : 0;

    return {
      symbol: h.symbol,
      shares,
      avgCost,
      sector: h.sector || 'Uncategorized',
      currentValue: Number(currentValue.toFixed(2)),
      costBasis: Number(costBasis.toFixed(2)),
      gainLoss: Number(gainLoss.toFixed(2)),
      gainLossPct: Number(gainLossPct.toFixed(2)),
      dayChange: 0, // TODO: Calculate from historical data
    };
  })};
  
  export async function addStock(symbol: string, currentPrice: number) {
  const client = await pool.connect()

  try {
    await client.query("BEGIN")

    // Check if the portfolio exists
    const portfolioRes = await client.query(
      `
      SELECT id
      FROM portfolios
      WHERE user_id = $1
      FOR UPDATE
      `,
      ["default_user"] // Replace with the actual user ID if available
    )

    if (portfolioRes.rowCount === 0) {
      throw new Error("Portfolio not found")
    }

    const portfolioId = portfolioRes.rows[0].id

    // Check if the stock already exists in the holdings
    const holdingRes = await client.query(
      `
      SELECT shares, avg_cost
      FROM holdings
      WHERE portfolio_id = $1 AND symbol = $2
      `,
      [portfolioId, symbol]
    )

    if (holdingRes.rowCount === 0) {
      // Insert a new stock into holdings
      await client.query(
        `
        INSERT INTO holdings (portfolio_id, symbol, shares, avg_cost)
        VALUES ($1, $2, $3, $4)
        `,
        [portfolioId, symbol, 0, currentPrice]
      )
    } else {
      // Update the existing stock's average cost
      const { shares, avg_cost } = holdingRes.rows[0]
      const newAvgCost = (shares * avg_cost + currentPrice) / (shares + 1)

      await client.query(
        `
        UPDATE holdings
        SET avg_cost = $1
        WHERE portfolio_id = $2 AND symbol = $3
        `,
        [newAvgCost, portfolioId, symbol]
      )
    }

    await client.query("COMMIT")
  } catch (err) {
    await client.query("ROLLBACK")
    throw err
  } finally {
    client.release()
  }
}
/**
 * BUY stock (ACID-safe)
 */
export async function buyStock(
  userId: string,
  symbol: string,
  shares: number,
  price: number,
  sector?: string
) {
  const totalCost = shares * price;
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const portfolioRes = await client.query(
      `
      SELECT id, cash_balance
      FROM portfolios
      WHERE user_id = $1
      FOR UPDATE
      `,
      [userId]
    );

    if (portfolioRes.rowCount === 0) {
      throw new Error("Portfolio not found");
    }

    const { id: portfolioId, cash_balance } = portfolioRes.rows[0];

    if (cash_balance < totalCost) {
      throw new Error("Insufficient funds");
    }

    await client.query(
      `
      INSERT INTO holdings (portfolio_id, symbol, shares, avg_cost, sector)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (portfolio_id, symbol)
      DO UPDATE SET
        shares = holdings.shares + EXCLUDED.shares,
        avg_cost =
          ((holdings.shares * holdings.avg_cost) +
           (EXCLUDED.shares * EXCLUDED.avg_cost))
          / (holdings.shares + EXCLUDED.shares)
      `,
      [portfolioId, symbol, shares, price, sector]
    );

    await client.query(
      `
      UPDATE portfolios
      SET cash_balance = cash_balance - $1
      WHERE id = $2
      `,
      [totalCost, portfolioId]
    );

    await client.query(
      `
      INSERT INTO transactions
      (portfolio_id, symbol, type, shares, price, total)
      VALUES ($1, $2, 'BUY', $3, $4, $5)
      `,
      [portfolioId, symbol, shares, price, totalCost]
    );

    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

/**
 * SELL stock (ACID-safe)
 */
export async function sellStock(
  userId: string,
  symbol: string,
  shares: number,
  price: number
) {
  const totalValue = shares * price;
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const portfolioRes = await client.query(
      `
      SELECT id
      FROM portfolios
      WHERE user_id = $1
      FOR UPDATE
      `,
      [userId]
    );

    if (portfolioRes.rowCount === 0) {
      throw new Error("Portfolio not found");
    }

    const portfolioId = portfolioRes.rows[0].id;

    const holdingRes = await client.query(
      `
      SELECT shares
      FROM holdings
      WHERE portfolio_id = $1 AND symbol = $2
      FOR UPDATE
      `,
      [portfolioId, symbol]
    );

    if (holdingRes.rowCount === 0 || holdingRes.rows[0].shares < shares) {
      throw new Error("Not enough shares");
    }

    await client.query(
      `
      UPDATE holdings
      SET shares = shares - $1
      WHERE portfolio_id = $2 AND symbol = $3
      `,
      [shares, portfolioId, symbol]
    );

    await client.query(
      `
      DELETE FROM holdings
      WHERE portfolio_id = $1 AND symbol = $2 AND shares = 0
      `,
      [portfolioId, symbol]
    );

    await client.query(
      `
      UPDATE portfolios
      SET cash_balance = cash_balance + $1
      WHERE id = $2
      `,
      [totalValue, portfolioId]
    );

    await client.query(
      `
      INSERT INTO transactions
      (portfolio_id, symbol, type, shares, price, total)
      VALUES ($1, $2, 'SELL', $3, $4, $5)
      `,
      [portfolioId, symbol, shares, price, totalValue]
    );

    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}
export async function addCashToPortfolio(userId: string, amount: number) {
  // Find the user's portfolio
  const res = await pool.query(
    `UPDATE portfolios SET cash_balance = cash_balance + $1 WHERE user_id = $2 RETURNING cash_balance`,
    [amount, userId]
  );
  return res.rows[0];
}