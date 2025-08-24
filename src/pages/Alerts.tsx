import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Bell, 
  Plus, 
  TrendingUp, 
  TrendingDown, 
  DollarSign,
  Percent,
  Clock,
  Settings,
  Trash2,
  AlertTriangle
} from "lucide-react";

interface Alert {
  id: string;
  title: string;
  description: string;
  type: 'price' | 'percentage' | 'news' | 'volume';
  symbol?: string;
  threshold: number;
  condition: 'above' | 'below';
  isActive: boolean;
  isTriggered: boolean;
  triggeredAt?: Date;
  createdAt: Date;
}

const initialAlerts: Alert[] = [
  {
    id: '1',
    title: 'AAPL Price Alert',
    description: 'Apple reaches $180',
    type: 'price',
    symbol: 'AAPL',
    threshold: 180,
    condition: 'above',
    isActive: true,
    isTriggered: false,
    createdAt: new Date('2024-01-15')
  },
  {
    id: '2',
    title: 'TSLA Drop Alert',
    description: 'Tesla drops below $200',
    type: 'price',
    symbol: 'TSLA',
    threshold: 200,
    condition: 'below',
    isActive: true,
    isTriggered: true,
    triggeredAt: new Date('2024-01-20T10:30:00'),
    createdAt: new Date('2024-01-10')
  },
  {
    id: '3',
    title: 'NVDA Gain Alert',
    description: 'NVDA gains 5% in a day',
    type: 'percentage',
    symbol: 'NVDA',
    threshold: 5,
    condition: 'above',
    isActive: true,
    isTriggered: true,
    triggeredAt: new Date('2024-01-19T14:20:00'),
    createdAt: new Date('2024-01-12')
  },
  {
    id: '4',
    title: 'Market News Alert',
    description: 'Federal Reserve announcements',
    type: 'news',
    threshold: 0,
    condition: 'above',
    isActive: true,
    isTriggered: false,
    createdAt: new Date('2024-01-08')
  },
];

const recentTriggers = [
  {
    id: '1',
    message: 'TSLA dropped to $195.40, triggering your price alert',
    timestamp: new Date('2024-01-20T10:30:00'),
    type: 'price',
    severity: 'warning'
  },
  {
    id: '2',
    message: 'NVDA gained 6.2% today, reaching $825.30',
    timestamp: new Date('2024-01-19T14:20:00'),
    type: 'percentage',
    severity: 'success'
  },
  {
    id: '3',
    message: 'Bitcoin ETF approval news impacting crypto markets',
    timestamp: new Date('2024-01-18T09:15:00'),
    type: 'news',
    severity: 'info'
  },
];

function AlertsContent() {
  const [alerts, setAlerts] = useState<Alert[]>(initialAlerts);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const toggleAlert = (id: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === id ? { ...alert, isActive: !alert.isActive } : alert
    ));
  };

  const deleteAlert = (id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'price': return DollarSign;
      case 'percentage': return Percent;
      case 'news': return Bell;
      default: return AlertTriangle;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'success': return 'text-success';
      case 'warning': return 'text-warning';
      case 'info': return 'text-primary';
      default: return 'text-muted-foreground';
    }
  };

  const activeAlertsCount = alerts.filter(alert => alert.isActive).length;
  const triggeredAlertsCount = alerts.filter(alert => alert.isTriggered).length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Alerts & Notifications</h1>
          <p className="text-muted-foreground">
            Set up personalized alerts for price movements and market events
          </p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Alert
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Alert</DialogTitle>
              <DialogDescription>
                Set up a new alert for price movements or market events
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="alertType">Alert Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select alert type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="price">Price Alert</SelectItem>
                    <SelectItem value="percentage">Percentage Change</SelectItem>
                    <SelectItem value="news">News Alert</SelectItem>
                    <SelectItem value="volume">Volume Alert</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="symbol">Symbol</Label>
                  <Input id="symbol" placeholder="AAPL" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="threshold">Threshold</Label>
                  <Input id="threshold" type="number" placeholder="180" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="condition">Condition</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="above">Above</SelectItem>
                    <SelectItem value="below">Below</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button className="w-full" onClick={() => setIsAddDialogOpen(false)}>
                Create Alert
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Alert Stats */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeAlertsCount}</div>
            <p className="text-xs text-muted-foreground">
              Currently monitoring
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Triggered Today</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{triggeredAlertsCount}</div>
            <p className="text-xs text-muted-foreground">
              Alerts fired
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Response Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">&lt; 1s</div>
            <p className="text-xs text-muted-foreground">
              Average delay
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Active Alerts */}
        <Card>
          <CardHeader>
            <CardTitle>Active Alerts</CardTitle>
            <CardDescription>
              Manage your current alert settings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {alerts.map((alert) => {
                const IconComponent = getAlertIcon(alert.type);
                return (
                  <div key={alert.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <IconComponent className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{alert.title}</span>
                          {alert.isTriggered && (
                            <Badge variant="destructive" className="text-xs">
                              Triggered
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {alert.description}
                        </p>
                        {alert.triggeredAt && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Last triggered: {alert.triggeredAt.toLocaleString()}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={alert.isActive}
                        onCheckedChange={() => toggleAlert(alert.id)}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteAlert(alert.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Recent Triggers */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest triggered alerts and notifications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTriggers.map((trigger) => (
                <div key={trigger.id} className="flex items-start gap-3 p-4 border border-border rounded-lg">
                  <div className={`p-2 rounded-lg ${
                    trigger.severity === 'success' ? 'bg-success/10' :
                    trigger.severity === 'warning' ? 'bg-warning/10' :
                    'bg-primary/10'
                  }`}>
                    {trigger.type === 'price' && <DollarSign className="w-4 h-4" />}
                    {trigger.type === 'percentage' && <Percent className="w-4 h-4" />}
                    {trigger.type === 'news' && <Bell className="w-4 h-4" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium mb-1">{trigger.message}</p>
                    <p className="text-xs text-muted-foreground">
                      {trigger.timestamp.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-primary" />
            Notification Settings
          </CardTitle>
          <CardDescription>
            Configure how you receive alert notifications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <h4 className="font-medium">Delivery Methods</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="email-notifications">Email Notifications</Label>
                  <Switch id="email-notifications" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="push-notifications">Push Notifications</Label>
                  <Switch id="push-notifications" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="sms-notifications">SMS Notifications</Label>
                  <Switch id="sms-notifications" />
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-medium">Alert Types</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="price-alerts">Price Alerts</Label>
                  <Switch id="price-alerts" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="news-alerts">Market News</Label>
                  <Switch id="news-alerts" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="portfolio-alerts">Portfolio Updates</Label>
                  <Switch id="portfolio-alerts" />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function Alerts() {
  return (
    <AppLayout>
      <AlertsContent />
    </AppLayout>
  );
}