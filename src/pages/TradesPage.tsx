import { useEffect } from 'react';
import { useAppStore } from '@/stores/app-store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TradesDataTable } from '@/components/TradesDataTable';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useShallow } from 'zustand/react/shallow';
export default function TradesPage() {
  const { trades, tradesLoading, tradesError, fetchTrades } = useAppStore(
    useShallow((state) => ({
      trades: state.trades,
      tradesLoading: state.tradesLoading,
      tradesError: state.tradesError,
      fetchTrades: state.fetchTrades,
    }))
  );
  useEffect(() => {
    fetchTrades();
  }, [fetchTrades]);
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold font-display">Trade History</h1>
        <p className="text-muted-foreground">A detailed log of all simulated trades.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>All Trades</CardTitle>
        </CardHeader>
        <CardContent>
          {tradesError ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <AlertTriangle className="w-12 h-12 text-destructive mb-4" />
              <h3 className="text-xl font-semibold mb-2">Failed to load trades</h3>
              <p className="text-muted-foreground mb-4">{tradesError}</p>
              <Button onClick={() => fetchTrades()}>Try Again</Button>
            </div>
          ) : (
            <TradesDataTable data={trades} loading={tradesLoading} />
          )}
        </CardContent>
      </Card>
      <footer className="text-center text-sm text-muted-foreground pt-8">
        Disclaimer: This is a simulation tool only and does not execute real trades.
      </footer>
    </div>
  );
}