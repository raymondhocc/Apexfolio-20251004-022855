import { useEffect } from 'react';
import { useAppStore } from '@/stores/app-store';
import { useShallow } from 'zustand/react/shallow';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertTriangle, Info, AlertCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import type { LogEntry } from '@shared/types';
const LogLevelIndicator = ({ level }: { level: LogEntry['level'] }) => {
  switch (level) {
    case 'info':
      return <Info className="h-4 w-4 text-blue-500" />;
    case 'warn':
      return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    case 'error':
      return <XCircle className="h-4 w-4 text-red-500" />;
    default:
      return null;
  }
};
const LogLevelBadge = ({ level }: { level: LogEntry['level'] }) => {
  return (
    <Badge
      variant="outline"
      className={cn(
        'capitalize',
        level === 'info' && 'border-blue-500/50 text-blue-500',
        level === 'warn' && 'border-yellow-500/50 text-yellow-500',
        level === 'error' && 'border-red-500/50 text-red-500'
      )}
    >
      {level}
    </Badge>
  );
};
export default function LogsPage() {
  const { logs, logsLoading, logsError, fetchLogs } = useAppStore(
    useShallow((state) => ({
      logs: state.logs,
      logsLoading: state.logsLoading,
      logsError: state.logsError,
      fetchLogs: state.fetchLogs,
    }))
  );
  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);
  const renderContent = () => {
    if (logsLoading) {
      return (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 p-3">
              <Skeleton className="h-5 w-5 rounded-full" />
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 flex-1" />
            </div>
          ))}
        </div>
      );
    }
    if (logsError) {
      return (
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <AlertTriangle className="w-12 h-12 text-destructive mb-4" />
          <h3 className="text-xl font-semibold mb-2">Failed to load logs</h3>
          <p className="text-muted-foreground mb-4">{logsError}</p>
          <Button onClick={() => fetchLogs()}>Try Again</Button>
        </div>
      );
    }
    return (
      <div className="space-y-2 font-mono text-sm">
        {logs.map((log) => (
          <div key={log.id} className="flex items-start gap-4 p-3 rounded-md hover:bg-accent">
            <LogLevelIndicator level={log.level} />
            <div className="flex-grow">
              <div className="flex items-center gap-4 mb-1">
                <span className="text-muted-foreground">{format(new Date(log.timestamp), 'PPpp')}</span>
                <LogLevelBadge level={log.level} />
              </div>
              <p className="text-foreground">{log.message}</p>
            </div>
          </div>
        ))}
      </div>
    );
  };
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold font-display">Logs</h1>
        <p className="text-muted-foreground">Raw, time-stamped log outputs from the simulated bot.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Bot Activity Log</CardTitle>
        </CardHeader>
        <CardContent>
          {renderContent()}
        </CardContent>
      </Card>
      <footer className="text-center text-sm text-muted-foreground pt-8">
        Disclaimer: This is a simulation tool only and does not execute real trades.
      </footer>
    </div>
  );
}