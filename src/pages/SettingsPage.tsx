import { useEffect } from 'react';
import { useAppStore } from '@/stores/app-store';
import { useShallow } from 'zustand/react/shallow';
import { SettingsForm } from '@/components/SettingsForm';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
export default function SettingsPage() {
  const { botSettings, settingsLoading, settingsError, fetchSettings } = useAppStore(
    useShallow((state) => ({
      botSettings: state.botSettings,
      settingsLoading: state.settingsLoading,
      settingsError: state.settingsError,
      fetchSettings: state.fetchSettings,
    }))
  );
  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);
  const renderContent = () => {
    if (settingsLoading) {
      return (
        <div className="space-y-8">
          <div className="space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-4 w-64" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-4 w-64" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>
      );
    }
    if (settingsError) {
      return (
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <AlertTriangle className="w-12 h-12 text-destructive mb-4" />
          <h3 className="text-xl font-semibold mb-2">Failed to load settings</h3>
          <p className="text-muted-foreground mb-4">{settingsError}</p>
          <Button onClick={() => fetchSettings()}>Try Again</Button>
        </div>
      );
    }
    if (botSettings) {
      return <SettingsForm defaultValues={botSettings} />;
    }
    return null;
  };
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold font-display">Settings</h1>
        <p className="text-muted-foreground">
          Configure the parameters for the simulated trading bot.
        </p>
      </div>
      {renderContent()}
      <footer className="text-center text-sm text-muted-foreground pt-8">
        Disclaimer: This is a simulation tool only and does not execute real trades.
      </footer>
    </div>
  );
}