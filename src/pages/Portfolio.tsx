import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Plus, 
  TrendingUp, 
  TrendingDown, 
  ArrowUpRight, 
  ArrowDownRight,
  Edit,
  Trash2,
  DollarSign
} from "lucide-react";

interface PortfolioItem {
  id: string;
  symbol: string;
  name: string;
  quantity: number;
  avgPrice: number;
  currentPrice: number;
  change: number;
  changePercent: number;
  recommendation: 'Buy' | 'Hold' | 'Sell';
  marketValue: number;
}

const initialPortfolio: PortfolioItem[] = [
  {
    id: '1',
    symbol: 'AAPL',
    name: 'Apple Inc.',
    quantity: 50,
    avgPrice: 150.25,
    currentPrice: 175.43,
    change: 4.21,
    changePercent: 2.46,
    recommendation: 'Hold',
    marketValue: 8771.50
  },
  {
    id: '2',
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    quantity: 25,
    avgPrice: 2800.00,
    currentPrice: 2847.63,
    change: -15.23,
    changePercent: -0.53,
    recommendation: 'Buy',
    marketValue: 71190.75
  },
  {
    id: '3',
    symbol: 'TSLA',
    name: 'Tesla Inc.',
    quantity: 30,
    avgPrice: 220.50,
    currentPrice: 248.87,
    change: 12.34,
    changePercent: 5.21,
    recommendation: 'Sell',
    marketValue: 7466.10
  },
  {
    id: '4',
    symbol: 'MSFT',
    name: 'Microsoft Corp.',
    quantity: 40,
    avgPrice: 350.75,
    currentPrice: 378.85,
    change: 5.67,
    changePercent: 1.52,
    recommendation: 'Hold',
    marketValue: 15154.00
  },
];

function PortfolioContent() {
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>(initialPortfolio);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const totalValue = portfolio.reduce((sum, item) => sum + item.marketValue, 0);
  const totalGainLoss = portfolio.reduce((sum, item) => {
    const gainLoss = (item.currentPrice - item.avgPrice) * item.quantity;
    return sum + gainLoss;
  }, 0);
  const totalGainLossPercent = (totalGainLoss / (totalValue - totalGainLoss)) * 100;

  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation) {
      case 'Buy': return 'bg-success/10 text-success border-success/20';
      case 'Sell': return 'bg-destructive/10 text-destructive border-destructive/20';
      default: return 'bg-warning/10 text-warning border-warning/20';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Portfolio</h1>
          <p className="text-muted-foreground">
            Manage your investments and track performance
          </p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Position
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Position</DialogTitle>
              <DialogDescription>
                Add a new stock or asset to your portfolio
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="symbol">Symbol</Label>
                  <Input id="symbol" placeholder="AAPL" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input id="quantity" type="number" placeholder="10" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="avgPrice">Average Price</Label>
                <Input id="avgPrice" type="number" placeholder="150.00" />
              </div>
              <Button className="w-full" onClick={() => setIsAddDialogOpen(false)}>
                Add Position
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Portfolio Summary */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Across {portfolio.length} positions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Gain/Loss</CardTitle>
            {totalGainLoss >= 0 ? (
              <TrendingUp className="h-4 w-4 text-success" />
            ) : (
              <TrendingDown className="h-4 w-4 text-destructive" />
            )}
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${
              totalGainLoss >= 0 ? 'text-success' : 'text-destructive'
            }`}>
              {totalGainLoss >= 0 ? '+' : '-'}${Math.abs(totalGainLoss).toLocaleString()}
            </div>
            <p className={`text-xs ${
              totalGainLoss >= 0 ? 'text-success' : 'text-destructive'
            }`}>
              {totalGainLoss >= 0 ? '+' : '-'}{Math.abs(totalGainLossPercent).toFixed(2)}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Day's Change</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">+$1,247</div>
            <p className="text-xs text-success">+1.2% today</p>
          </CardContent>
        </Card>
      </div>

      {/* Portfolio Table */}
      <Card>
        <CardHeader>
          <CardTitle>Holdings</CardTitle>
          <CardDescription>
            Your current positions and their performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Asset</TableHead>
                <TableHead className="text-right">Quantity</TableHead>
                <TableHead className="text-right">Avg Price</TableHead>
                <TableHead className="text-right">Current Price</TableHead>
                <TableHead className="text-right">Change</TableHead>
                <TableHead className="text-right">Market Value</TableHead>
                <TableHead className="text-center">AI Recommendation</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {portfolio.map((item) => {
                const gainLoss = (item.currentPrice - item.avgPrice) * item.quantity;
                const gainLossPercent = ((item.currentPrice - item.avgPrice) / item.avgPrice) * 100;
                
                return (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{item.symbol}</div>
                        <div className="text-sm text-muted-foreground">{item.name}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">{item.quantity}</TableCell>
                    <TableCell className="text-right">${item.avgPrice.toFixed(2)}</TableCell>
                    <TableCell className="text-right">${item.currentPrice.toFixed(2)}</TableCell>
                    <TableCell className="text-right">
                      <div className={`flex items-center justify-end ${
                        item.changePercent >= 0 ? 'text-success' : 'text-destructive'
                      }`}>
                        {item.changePercent >= 0 ? (
                          <ArrowUpRight className="w-3 h-3 mr-1" />
                        ) : (
                          <ArrowDownRight className="w-3 h-3 mr-1" />
                        )}
                        {Math.abs(item.changePercent).toFixed(2)}%
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div>${item.marketValue.toLocaleString()}</div>
                      <div className={`text-xs ${
                        gainLoss >= 0 ? 'text-success' : 'text-destructive'
                      }`}>
                        {gainLoss >= 0 ? '+' : '-'}${Math.abs(gainLoss).toFixed(0)} 
                        ({gainLoss >= 0 ? '+' : '-'}{Math.abs(gainLossPercent).toFixed(1)}%)
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge className={getRecommendationColor(item.recommendation)}>
                        {item.recommendation}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <Button variant="ghost" size="icon">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

export default function Portfolio() {
  return (
    <AppLayout>
      <PortfolioContent />
    </AppLayout>
  );
}