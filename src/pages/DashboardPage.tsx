import { useEffect } from 'react';
import { DollarSign, TrendingUp, Bot, AlertTriangle } from 'lucide-react';
import { useAppStore } from '@/stores/app-store';
import { StatCard } from '@/components/StatCard';
import { PerformanceChart } from '@/components/PerformanceChart';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useShallow } from 'zustand/react/shallow';
function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);
}
export default function DashboardPage() {
  const { dashboardData, loading, error, fetchDashboardData, startBot, stopBot } = useAppStore(
    useShallow((state) => ({
      dashboardData: state.dashboardData,
      loading: state.loading,
      error: state.error,
      fetchDashboardData: state.fetchDashboardData,
      startBot: state.startBot,
      stopBot: state.stopBot,
    }))
  );
  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);
  const botStatus = dashboardData?.botStatus || 'stopped';
  const isBotRunning = botStatus === 'running';
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] text-center">
        <AlertTriangle className="w-16 h-16 text-destructive mb-4" />
        <h2 className="text-2xl font-semibold mb-2">Failed to load dashboard</h2>
        <p className="text-muted-foreground mb-4">{error}</p>
        <Button onClick={() => fetchDashboardData()}>Try Again</Button>
      </div>
    );
  }
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display">Dashboard</h1>
          <p className="text-muted-foreground">Welcome to your simulated trading dashboard.</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={isBotRunning ? 'default' : 'outline'} className={cn('transition-colors', isBotRunning && 'bg-green-500/20 text-green-500 border-green-500/30')}>
            Bot Status: {botStatus.charAt(0).toUpperCase() + botStatus.slice(1)}
          </Badge>
          <Button onClick={isBotRunning ? stopBot : startBot} size="sm">
            {isBotRunning ? 'Stop Bot' : 'Start Bot'}
          </Button>
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Portfolio Value"
          value={loading ? '...' : formatCurrency(dashboardData?.portfolioValue ?? 0)}
          icon={DollarSign}
          loading={loading}
        />
        <StatCard
          title="Today's P/L"
          value={loading ? '...' : formatCurrency(dashboardData?.todayPL ?? 0)}
          icon={TrendingUp}
          changeType={(dashboardData?.todayPL ?? 0) >= 0 ? 'positive' : 'negative'}
          loading={loading}
        />
        <StatCard
          title="Total P/L"
          value={loading ? '...' : formatCurrency(dashboardData?.totalPL ?? 0)}
          icon={Bot}
          changeType={(dashboardData?.totalPL ?? 0) >= 0 ? 'positive' : 'negative'}
          loading={loading}
        />
      </div>
      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <PerformanceChart data={dashboardData?.performance ?? []} loading={loading} />
        </div>
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Trades</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Symbol</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading && Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium">Loading...</TableCell>
                      <TableCell>...</TableCell>
                      <TableCell className="text-right">...</TableCell>
                    </TableRow>
                  ))}
                  {!loading && dashboardData?.recentTrades.map((trade) => (
                    <TableRow key={trade.id}>
                      <TableCell className="font-medium">{trade.symbol}</TableCell>
                      <TableCell>
                        <Badge variant={trade.action === 'buy' ? 'outline' : 'destructive'} className={cn(trade.action === 'buy' && 'border-green-500/50 text-green-500')}>
                          {trade.action}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">{formatCurrency(trade.price * trade.quantity)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
      <footer className="text-center text-sm text-muted-foreground pt-8">
        Disclaimer: This is a simulation tool only and does not execute real trades.
      </footer>
    </div>
  );
}