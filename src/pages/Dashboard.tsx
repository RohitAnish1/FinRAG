import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  PieChart, 
  Target,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles
} from "lucide-react";

const portfolioData = [
  { name: "AAPL", shares: 50, price: 175.43, change: 2.34, recommendation: "Hold" },
  { name: "GOOGL", shares: 25, price: 2847.63, change: -1.23, recommendation: "Buy" },
  { name: "TSLA", shares: 30, price: 248.87, change: 5.67, recommendation: "Sell" },
  { name: "MSFT", shares: 40, price: 378.85, change: 1.45, recommendation: "Hold" },
];

const suggestions = [
  { 
    stock: "NVDA", 
    reason: "Strong AI growth potential", 
    confidence: 87, 
    risk: "Medium",
    action: "Buy"
  },
  { 
    stock: "BTC-ETF", 
    reason: "Crypto market recovery signals", 
    confidence: 72, 
    risk: "High",
    action: "Consider"
  },
  { 
    stock: "SPY", 
    reason: "Diversification opportunity", 
    confidence: 94, 
    risk: "Low",
    action: "Buy"
  },
];

function DashboardContent() {
  const totalValue = portfolioData.reduce((sum, stock) => sum + (stock.shares * stock.price), 0);
  const totalChange = portfolioData.reduce((sum, stock) => sum + (stock.shares * stock.price * stock.change / 100), 0);
  const changePercent = (totalChange / totalValue) * 100;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's your financial overview.
        </p>
      </div>

      {/* Portfolio Overview */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Portfolio</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalValue.toLocaleString()}</div>
            <div className={`flex items-center text-xs ${changePercent >= 0 ? 'text-success' : 'text-destructive'}`}>
              {changePercent >= 0 ? (
                <TrendingUp className="mr-1 h-3 w-3" />
              ) : (
                <TrendingDown className="mr-1 h-3 w-3" />
              )}
              {Math.abs(changePercent).toFixed(2)}% from yesterday
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Day's Change</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${totalChange >= 0 ? 'text-success' : 'text-destructive'}`}>
              ${Math.abs(totalChange).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {totalChange >= 0 ? 'Gain' : 'Loss'} today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Positions</CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{portfolioData.length}</div>
            <p className="text-xs text-muted-foreground">
              Across {portfolioData.length} stocks
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Confidence</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">84%</div>
            <Progress value={84} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Portfolio Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Portfolio Summary</CardTitle>
            <CardDescription>Your current holdings and performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {portfolioData.map((stock) => (
                <div key={stock.name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="font-medium">{stock.name}</div>
                    <Badge variant="secondary">{stock.shares} shares</Badge>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">${stock.price}</div>
                    <div className={`flex items-center text-sm ${
                      stock.change >= 0 ? 'text-success' : 'text-destructive'
                    }`}>
                      {stock.change >= 0 ? (
                        <ArrowUpRight className="mr-1 h-3 w-3" />
                      ) : (
                        <ArrowDownRight className="mr-1 h-3 w-3" />
                      )}
                      {Math.abs(stock.change)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* AI Suggestions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              AI Investment Suggestions
            </CardTitle>
            <CardDescription>
              Personalized recommendations based on market analysis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {suggestions.map((suggestion) => (
                <div key={suggestion.stock} className="p-4 border border-border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium">{suggestion.stock}</div>
                    <Badge 
                      variant={suggestion.action === 'Buy' ? 'default' : 'secondary'}
                    >
                      {suggestion.action}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {suggestion.reason}
                  </p>
                  <div className="flex items-center justify-between text-xs">
                    <span>Confidence: {suggestion.confidence}%</span>
                    <span className={`px-2 py-1 rounded ${
                      suggestion.risk === 'Low' ? 'bg-success/10 text-success' :
                      suggestion.risk === 'Medium' ? 'bg-warning/10 text-warning' :
                      'bg-destructive/10 text-destructive'
                    }`}>
                      {suggestion.risk} Risk
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Market Sentiment Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Market Sentiment Overview</CardTitle>
          <CardDescription>
            Current market trends and sentiment analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center p-4 border border-border rounded-lg">
              <div className="text-2xl font-bold text-success">Bullish</div>
              <div className="text-sm text-muted-foreground">Tech Sector</div>
              <Progress value={75} className="mt-2" />
            </div>
            <div className="text-center p-4 border border-border rounded-lg">
              <div className="text-2xl font-bold text-warning">Neutral</div>
              <div className="text-sm text-muted-foreground">Energy Sector</div>
              <Progress value={50} className="mt-2" />
            </div>
            <div className="text-center p-4 border border-border rounded-lg">
              <div className="text-2xl font-bold text-destructive">Bearish</div>
              <div className="text-sm text-muted-foreground">Real Estate</div>
              <Progress value={25} className="mt-2" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function Dashboard() {
  return (
    <AppLayout>
      <DashboardContent />
    </AppLayout>
  );
}