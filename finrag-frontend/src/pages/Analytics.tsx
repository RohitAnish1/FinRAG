"use client"

import { useNavigate } from "react-router-dom"
import { useAnalytics } from "../hooks/useAnalytics"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Button } from "../components/ui/button"
import { Progress } from "../components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import MobileHeader from "../components/MobileHeader"
import Sidebar from "../components/Sidebar"

export default function Analytics() {
  const navigate = useNavigate()
  const { analytics, loading, error } = useAnalytics()

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <MobileHeader showSidebarButton />
        <Sidebar />
        <main className="md:ml-64 p-6">
          <div className="text-center">Loading analytics...</div>
        </main>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <MobileHeader showSidebarButton />
        <Sidebar />
        <main className="md:ml-64 p-6">
          <div className="text-center text-red-500">Error loading analytics: {error}</div>
        </main>
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="min-h-screen bg-gray-50">
        <MobileHeader showSidebarButton />
        <Sidebar />
        <main className="md:ml-64 p-6">
          <div className="text-center text-muted-foreground">No analytics data available</div>
        </main>
      </div>
    )
  }

  const { portfolio, goals } = analytics

  return (
    <div className="min-h-screen bg-gray-50">
      <MobileHeader showSidebarButton />
      <Sidebar />

      <main className="md:ml-64 p-6">
        {/* Header */}
        <div className="hidden md:flex items-center justify-between mb-6 bg-white p-6 rounded-lg shadow">
          <div>
            <h1 className="text-2xl font-bold">Portfolio Analytics</h1>
            <p className="text-gray-600">Insights and performance metrics</p>
          </div>
          <Button onClick={() => navigate("/chat")} size="sm">
            Ask AI Assistant
          </Button>
        </div>

        {/* Key Metrics Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <MetricCard
            title="Total Value"
            value={portfolio?.totalValue?.toFixed(2) || '0.00'}
            icon="💰"
          />
          <MetricCard
            title="Cash Balance"
            value={portfolio?.cashBalance?.toFixed(2) || '0.00'}
            icon="💵"
            percentage={portfolio?.cashRatio?.toFixed(1)}
          />
          <MetricCard
            title="Invested Value"
            value={portfolio?.investedValue?.toFixed(2) || '0.00'}
            icon="📈"
          />
          <MetricCard
            title="Diversification"
            value={portfolio?.diversificationScore || 'N/A'}
            icon="🎯"
            showBadge
          />
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="allocation">Allocation</TabsTrigger>
            <TabsTrigger value="goals">Goals</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Portfolio Health</CardTitle>
                  <CardDescription>Risk and diversification metrics</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <HealthMetric
                    label="Concentration Risk"
                    value={portfolio?.concentrationRisk?.toFixed(2) || '0.00'}
                    unit="%"
                    description="Largest holding as % of portfolio"
                    status={getConcentrationStatus(portfolio?.concentrationRisk)}
                  />
                  <HealthMetric
                    label="Cash Ratio"
                    value={portfolio?.cashRatio?.toFixed(2) || '0.00'}
                    unit="%"
                    description="Cash as % of total portfolio"
                    status={getCashRatioStatus(portfolio?.cashRatio)}
                  />
                  <HealthMetric
                    label="Diversification Score"
                    value={portfolio?.diversificationScore || 'N/A'}
                    description="Overall portfolio diversification"
                    status={getDiversificationStatus(portfolio?.diversificationScore)}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Portfolio Composition</CardTitle>
                  <CardDescription>Breakdown of your investments</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center p-4 border rounded-lg">
                    <div>
                      <div className="font-medium">Total Value</div>
                      <div className="text-sm text-muted-foreground">Complete portfolio worth</div>
                    </div>
                    <div className="text-2xl font-bold">₹{portfolio?.totalValue?.toFixed(2) || '0.00'}</div>
                  </div>
                  <div className="flex justify-between items-center p-4 border rounded-lg">
                    <div>
                      <div className="font-medium">Invested Amount</div>
                      <div className="text-sm text-muted-foreground">Stocks and securities</div>
                    </div>
                    <div className="text-2xl font-bold">₹{portfolio?.investedValue?.toFixed(2) || '0.00'}</div>
                  </div>
                  <div className="flex justify-between items-center p-4 border rounded-lg">
                    <div>
                      <div className="font-medium">Available Cash</div>
                      <div className="text-sm text-muted-foreground">Ready for investment</div>
                    </div>
                    <div className="text-2xl font-bold">₹{portfolio?.cashBalance?.toFixed(2) || '0.00'}</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Allocation Tab */}
          <TabsContent value="allocation">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Asset Allocation by Symbol</CardTitle>
                  <CardDescription>Distribution across stocks</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {portfolio?.allocationBySymbol && Object.keys(portfolio.allocationBySymbol).length > 0 ? (
                    Object.entries(portfolio.allocationBySymbol).map(
                      ([symbol, value]: [string, any]) => {
                        const percentage = portfolio.totalValue > 0 
                          ? ((Number(value) / portfolio.totalValue) * 100).toFixed(1)
                          : '0.0'
                        return (
                          <div key={symbol} className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="font-medium">{symbol}</span>
                              <span className="text-muted-foreground">
                                {percentage}% • ₹{Number(value).toFixed(2)}
                              </span>
                            </div>
                            <Progress value={parseFloat(percentage)} />
                          </div>
                        )
                      }
                    )
                  ) : (
                    <div className="text-center text-muted-foreground py-8">
                      No holdings yet. Start investing to see allocation.
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Sector Allocation</CardTitle>
                  <CardDescription>Distribution across sectors</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {portfolio?.allocationBySector && Object.keys(portfolio.allocationBySector).length > 0 ? (
                    Object.entries(portfolio.allocationBySector).map(
                      ([sector, value]: [string, any]) => {
                        const percentage = portfolio.totalValue > 0 
                          ? ((Number(value) / portfolio.totalValue) * 100).toFixed(1)
                          : '0.0'
                        return (
                          <div key={sector} className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="font-medium">{sector}</span>
                              <span className="text-muted-foreground">
                                {percentage}% • ₹{Number(value).toFixed(2)}
                              </span>
                            </div>
                            <Progress value={parseFloat(percentage)} />
                          </div>
                        )
                      }
                    )
                  ) : (
                    <div className="text-center text-muted-foreground py-8">
                      No sector data available
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Goals Tab */}
          <TabsContent value="goals">
            <Card>
              <CardHeader>
                <CardTitle>Financial Goals Progress</CardTitle>
                <CardDescription>Track your savings and investment goals</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {goals && goals.length > 0 ? (
                  goals.map((g: any, idx: number) => (
                    <div key={idx} className="p-4 border rounded-lg space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium text-lg">{g.title}</div>
                          <Badge variant={g.status === 'on-track' ? 'default' : 'destructive'} className="mt-1">
                            {g.status}
                          </Badge>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold">{g.completion?.toFixed(1) || '0.0'}%</div>
                          <div className="text-sm text-muted-foreground">Complete</div>
                        </div>
                      </div>
                      
                      <Progress value={g.completion || 0} className="h-3" />
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        {g.requiredMonthly && (
                          <div>
                            <div className="text-muted-foreground">Required Monthly</div>
                            <div className="font-medium">₹{g.requiredMonthly.toFixed(2)}</div>
                          </div>
                        )}
                        {g.monthsRemaining !== null && (
                          <div>
                            <div className="text-muted-foreground">Months Remaining</div>
                            <div className="font-medium">{g.monthsRemaining}</div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-muted-foreground py-8">
                    No goals set yet. Create goals to track your progress.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

/* Helper Components */

function MetricCard({ title, value, icon, percentage, showBadge }: any) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
          <span className="text-2xl">{icon}</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {showBadge ? value : `₹${value}`}
        </div>
        {percentage && (
          <div className="text-sm text-muted-foreground mt-1">{percentage}% of portfolio</div>
        )}
      </CardContent>
    </Card>
  )
}

function HealthMetric({ label, value, unit, description, status }: any) {
  return (
    <div className="flex justify-between items-center p-3 border rounded-lg">
      <div>
        <div className="font-medium">{label}</div>
        <div className="text-xs text-muted-foreground">{description}</div>
      </div>
      <div className="text-right">
        <div className="text-xl font-bold">
          {value}{unit}
        </div>
        <Badge variant={status === 'good' ? 'default' : status === 'moderate' ? 'secondary' : 'destructive'} className="mt-1">
          {status}
        </Badge>
      </div>
    </div>
  )
}

/* Helper Functions */

function getConcentrationStatus(risk?: number): string {
  if (!risk) return 'unknown'
  if (risk < 20) return 'good'
  if (risk < 40) return 'moderate'
  return 'high'
}

function getCashRatioStatus(ratio?: number): string {
  if (!ratio) return 'unknown'
  if (ratio >= 10 && ratio <= 30) return 'good'
  if (ratio < 10 || ratio <= 50) return 'moderate'
  return 'high'
}

function getDiversificationStatus(score?: string): string {
  if (!score) return 'unknown'
  if (score === 'High') return 'good'
  if (score === 'Medium') return 'moderate'
  return 'low'
}