"use client"
import { useState } from "react";
import { useNavigate } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"
import { usePortfolio } from "../hooks/usePortfolio"
import { useAnalytics } from "../hooks/useAnalytics"
import MobileHeader from "../components/MobileHeader"
import Sidebar from "../components/Sidebar"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Badge } from "../components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Progress } from "../components/ui/progress"
import * as portfolioApi from "../api/portfolio.api";
// Icons removed as they were unused

export default function Portfolio() {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const { portfolio, loading, error, refresh, addCash: addCashToPortfolio } = usePortfolio()
    const { analytics } = useAnalytics()
  const [addAmount, setAddAmount] = useState("");
  const [adding, setAdding] = useState(false);
  const handleBuy = (symbol: string) => {
    // Call backend API to buy stock
  };

  const handleSell = (symbol: string) => {
    // Call backend API to sell stock
  };

  if (loading) {
    return <div className="p-6">Loading portfolio...</div>
  }

  if (error || !portfolio) {
    return <div className="p-6 text-red-500">Error: {error || "Failed to load portfolio"}</div>
  }

  const portfolioSummary = {
    totalValue: analytics?.totalValue ?? portfolio.totalValue,
    dayChange: portfolio.dayPnL,
    dayChangePercent: portfolio.dayPnLPct,
    totalGain: portfolio.totalPnL,
    totalGainPercent: portfolio.totalPnLPct,
    cashBalance: analytics?.cashBalance ?? portfolio.cashBalance,
  }

  const holdings = portfolio.holdings ?? []
  const recentTransactions = portfolio.transactions ?? []
  async function handleAddCash() {
    setAdding(true);
    try {
      await addCashToPortfolio(Number(addAmount));
      setAddAmount("");
    } catch (e) {
      alert("Failed to add cash");
    }
    setAdding(false);
  }
  // derive sector allocation
  const sectorAllocation = Object.values(
    holdings.reduce((acc: any, h: any) => {
      acc[h.sector] ??= { sector: h.sector, value: 0 }
      acc[h.sector].value += h.currentValue
      return acc
    }, {})
  ).map((s: any) => ({
    ...s,
    percentage: ((s.value / portfolio.totalValue) * 100).toFixed(1),
    target: 20, // static for now
  }))

  return (
    <div className="min-h-screen bg-gray-50">
      <MobileHeader showSidebarButton />
      <Sidebar />

      <main className="md:ml-64 p-4">
        {/* Header */}
        <div className="hidden md:flex items-center justify-between mb-6 bg-white p-6 rounded-lg shadow">
          <div>
            <h1 className="text-2xl font-bold">Portfolio Management</h1>
            <p className="text-gray-600">Track and manage your investments</p>
          </div>
          <Button onClick={() => navigate("/chat")} size="sm">
            Ask AI Assistant
          </Button>
        </div>
        <div className="mb-4 flex gap-2">
    <input
      type="number"
      value={addAmount}
      onChange={e => setAddAmount(e.target.value)}
      placeholder="Enter amount"
      className="border rounded px-2 py-1"
      min={1}
    />
    <Button onClick={handleAddCash} disabled={adding || !addAmount}>Add Amount</Button>
  </div>
        {/* Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <SummaryCard title="Total Portfolio" value={portfolioSummary.totalValue} />
          <SummaryCard title="Today's Change" value={portfolioSummary.dayChange} pct={portfolioSummary.dayChangePercent} />
          <SummaryCard title="Total Gain" value={portfolioSummary.totalGain} pct={portfolioSummary.totalGainPercent} />
          <SummaryCard title="Cash Balance" value={portfolioSummary.cashBalance} />
        </div>

        <Tabs defaultValue="holdings" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="holdings">Holdings</TabsTrigger>
            <TabsTrigger value="allocation">Allocation</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
          </TabsList>

          {/* Holdings */}
          <TabsContent value="holdings">
            <Card>
              <CardHeader>
                <CardTitle>Current Holdings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {holdings.map((h: any) => (
                  <div key={h.symbol} className="flex justify-between p-4 border rounded-lg">
                    <div>
                      <div className="font-medium">{h.symbol}</div>
                      <div className="text-sm text-muted-foreground">{h.shares} shares • {h.sector}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">₹{h.currentValue}</div>
                      <Badge variant={h.dayChange >= 0 ? "default" : "destructive"}>
                        {h.dayChange >= 0 ? "+" : ""}{h.dayChange}%
                      </Badge>
                      <div className="flex gap-2 mt-2">
                        <Button size="sm" onClick={() => handleBuy(h.symbol)}>Buy</Button>
                        <Button size="sm" variant="outline" onClick={() => handleSell(h.symbol)}>Sell</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Allocation */}
          <TabsContent value="allocation">
            <Card>
              <CardHeader>
                <CardTitle>Sector Allocation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {sectorAllocation.map((s: any) => (
                  <div key={s.sector}>
                    <div className="flex justify-between text-sm">
                      <span>{s.sector}</span>
                      <span>{s.percentage}%</span>
                    </div>
                    <Progress value={s.percentage} />
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Performance (static) */}
          <TabsContent value="performance">
            <Card>
              <CardHeader>
                <CardTitle>Performance Analytics</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-3 gap-6">
                <Metric label="Sharpe Ratio" value="1.24" />
                <Metric label="Beta" value="1.15" />
                <Metric label="Max Drawdown" value="-18.2%" />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Transactions */}
          <TabsContent value="transactions">
            <Card>
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentTransactions.map((t: any, i: number) => (
                  <div key={i} className="flex justify-between p-4 border rounded-lg">
                    <div>
                      <div className="font-medium">{t.type} {t.symbol}</div>
                      <div className="text-sm text-muted-foreground">{t.shares} shares @ ₹{t.price}</div>
                    </div>
                    <div className="font-medium">₹{t.total}</div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

/* small helpers */

function SummaryCard({ title, value, pct }: any) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">₹{value}</div>
        {pct && <Badge className="mt-2">{pct}%</Badge>}
      </CardContent>
    </Card>
  )
}

function Metric({ label, value }: any) {
  return (
    <div>
      <div className="text-sm text-muted-foreground">{label}</div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  )
}
