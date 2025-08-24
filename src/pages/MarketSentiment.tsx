import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  BarChart3,
  PieChart,
  Globe,
  Brain,
  Zap
} from "lucide-react";

const sectorSentiment = [
  { name: 'Technology', sentiment: 'Bullish', score: 78, change: 5.2 },
  { name: 'Healthcare', sentiment: 'Bullish', score: 72, change: 2.1 },
  { name: 'Financial', sentiment: 'Neutral', score: 58, change: -1.3 },
  { name: 'Energy', sentiment: 'Neutral', score: 52, change: 0.8 },
  { name: 'Consumer Discretionary', sentiment: 'Bearish', score: 38, change: -4.7 },
  { name: 'Real Estate', sentiment: 'Bearish', score: 32, change: -6.2 },
];

const marketIndicators = [
  { name: 'Fear & Greed Index', value: 67, status: 'Greed', color: 'text-warning' },
  { name: 'VIX (Volatility)', value: 18.5, status: 'Low', color: 'text-success' },
  { name: 'Dollar Index', value: 103.2, status: 'Strong', color: 'text-primary' },
  { name: 'Bond Yield (10Y)', value: 4.2, status: 'High', color: 'text-destructive' },
];

const newsImpact = [
  {
    headline: "Fed Hints at Rate Cuts in Q2 2024",
    impact: "Positive",
    sectors: ["Technology", "Growth Stocks"],
    confidence: 85
  },
  {
    headline: "China Manufacturing Data Beats Expectations",
    impact: "Positive",
    sectors: ["Commodities", "Industrial"],
    confidence: 72
  },
  {
    headline: "Banking Sector Faces Credit Concerns",
    impact: "Negative",
    sectors: ["Financial", "REITs"],
    confidence: 68
  },
];

function MarketSentimentContent() {
  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'Bullish': return 'text-success';
      case 'Bearish': return 'text-destructive';
      default: return 'text-warning';
    }
  };

  const getSentimentBadgeColor = (sentiment: string) => {
    switch (sentiment) {
      case 'Bullish': return 'bg-success/10 text-success border-success/20';
      case 'Bearish': return 'bg-destructive/10 text-destructive border-destructive/20';
      default: return 'bg-warning/10 text-warning border-warning/20';
    }
  };

  const getImpactColor = (impact: string) => {
    return impact === 'Positive' ? 'text-success' : 'text-destructive';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Market Sentiment</h1>
        <p className="text-muted-foreground">
          AI-powered analysis of market trends and sentiment indicators
        </p>
      </div>

      {/* Market Overview */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {marketIndicators.map((indicator) => (
          <Card key={indicator.name}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{indicator.name}</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{indicator.value}</div>
              <div className={`text-xs ${indicator.color}`}>
                {indicator.status}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Sector Sentiment */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5 text-primary" />
              Sector Sentiment Analysis
            </CardTitle>
            <CardDescription>
              AI sentiment analysis across major market sectors
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sectorSentiment.map((sector) => (
                <div key={sector.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="font-medium">{sector.name}</span>
                      <Badge className={getSentimentBadgeColor(sector.sentiment)}>
                        {sector.sentiment}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">{sector.score}/100</div>
                      <div className={`text-xs flex items-center ${
                        sector.change >= 0 ? 'text-success' : 'text-destructive'
                      }`}>
                        {sector.change >= 0 ? (
                          <TrendingUp className="w-3 h-3 mr-1" />
                        ) : (
                          <TrendingDown className="w-3 h-3 mr-1" />
                        )}
                        {Math.abs(sector.change)}%
                      </div>
                    </div>
                  </div>
                  <Progress value={sector.score} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* AI Market Outlook */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              AI Market Outlook
            </CardTitle>
            <CardDescription>
              Machine learning insights on market direction
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="text-center p-6 border border-border rounded-lg bg-gradient-to-br from-primary/5 to-blue-500/5">
                <div className="text-3xl font-bold text-success mb-2">Moderately Bullish</div>
                <div className="text-sm text-muted-foreground mb-4">
                  Next 30 days outlook
                </div>
                <Progress value={72} className="mb-2" />
                <div className="text-xs text-muted-foreground">72% confidence</div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium">Key Factors:</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-success"></div>
                    <span>Strong earnings season performance (+15%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-success"></div>
                    <span>Favorable monetary policy signals</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-warning"></div>
                    <span>Geopolitical tensions remain elevated</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-destructive"></div>
                    <span>Inflation concerns persist</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* News Impact Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-primary" />
            News Impact Analysis
          </CardTitle>
          <CardDescription>
            Real-time analysis of market-moving news and events
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {newsImpact.map((news, index) => (
              <div key={index} className="p-4 border border-border rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-sm flex-1">{news.headline}</h4>
                  <Badge className={`ml-2 ${
                    news.impact === 'Positive' 
                      ? 'bg-success/10 text-success border-success/20'
                      : 'bg-destructive/10 text-destructive border-destructive/20'
                  }`}>
                    {news.impact}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <span>Affected sectors:</span>
                    <div className="flex gap-1">
                      {news.sectors.map((sector) => (
                        <span key={sector} className="px-2 py-1 bg-muted rounded">
                          {sector}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Zap className="w-3 h-3" />
                    <span>{news.confidence}% confidence</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Chart Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Sentiment Trend Chart
          </CardTitle>
          <CardDescription>
            Historical sentiment analysis over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-gradient-to-br from-primary/5 to-blue-500/5 rounded-lg flex items-center justify-center border border-border">
            <div className="text-center">
              <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                Sentiment trend visualization will be displayed here
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Connect to backend API for real-time chart data
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function MarketSentiment() {
  return (
    <AppLayout>
      <MarketSentimentContent />
    </AppLayout>
  );
}