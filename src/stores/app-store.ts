import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { DashboardData, BotStatus, Trade, BotSettings, LogEntry } from '@shared/types';
import { api } from '@/lib/api';
import { toast } from 'sonner';
type AppState = {
  loading: boolean;
  error: string | null;
  dashboardData: DashboardData | null;
  trades: Trade[];
  tradesLoading: boolean;
  tradesError: string | null;
  botSettings: BotSettings | null;
  settingsLoading: boolean;
  settingsError: string | null;
  logs: LogEntry[];
  logsLoading: boolean;
  logsError: string | null;
  fetchDashboardData: () => Promise<void>;
  fetchTrades: () => Promise<void>;
  fetchSettings: () => Promise<void>;
  fetchLogs: () => Promise<void>;
  updateSettings: (settings: BotSettings) => Promise<void>;
  setBotStatus: (status: BotStatus) => void;
  startBot: () => Promise<void>;
  stopBot: () => Promise<void>;
};
export const useAppStore = create<AppState>()(
  immer((set) => ({
    loading: true,
    error: null,
    dashboardData: null,
    trades: [],
    tradesLoading: true,
    tradesError: null,
    botSettings: null,
    settingsLoading: true,
    settingsError: null,
    logs: [],
    logsLoading: true,
    logsError: null,
    fetchDashboardData: async () => {
      set((state) => {
        state.loading = true;
        state.error = null;
      });
      try {
        const data = await api.getDashboardData();
        set((state) => {
          state.dashboardData = data;
          state.loading = false;
        });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch dashboard data';
        set((state) => {
          state.error = errorMessage;
          state.loading = false;
        });
      }
    },
    fetchTrades: async () => {
      set((state) => {
        state.tradesLoading = true;
        state.tradesError = null;
      });
      try {
        const data = await api.getTrades();
        set((state) => {
          state.trades = data;
          state.tradesLoading = false;
        });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch trades';
        set((state) => {
          state.tradesError = errorMessage;
          state.tradesLoading = false;
        });
      }
    },
    fetchSettings: async () => {
      set((state) => {
        state.settingsLoading = true;
        state.settingsError = null;
      });
      try {
        const data = await api.getSettings();
        set((state) => {
          state.botSettings = data;
          state.settingsLoading = false;
        });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch settings';
        set((state) => {
          state.settingsError = errorMessage;
          state.settingsLoading = false;
        });
      }
    },
    fetchLogs: async () => {
        set((state) => {
            state.logsLoading = true;
            state.logsError = null;
        });
        try {
            const data = await api.getLogs();
            set((state) => {
                state.logs = data;
                state.logsLoading = false;
            });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to fetch logs';
            set((state) => {
                state.logsError = errorMessage;
                state.logsLoading = false;
            });
        }
    },
    updateSettings: async (settings: BotSettings) => {
      const promise = api.updateSettings(settings);
      toast.promise(promise, {
        loading: 'Saving settings...',
        success: (data) => {
          set((state) => {
            state.botSettings = data;
          });
          return 'Settings saved successfully!';
        },
        error: 'Failed to save settings.',
      });
      await promise;
    },
    setBotStatus: (status: BotStatus) => {
      set((state) => {
        if (state.dashboardData) {
          state.dashboardData.botStatus = status;
        }
      });
    },
    startBot: async () => {
      try {
        await api.startBot();
        set((state) => {
          if (state.dashboardData) state.dashboardData.botStatus = 'running';
        });
        toast.success('Bot started successfully!');
      } catch (error) {
        console.error('Failed to start bot', error);
        toast.error('Failed to start bot.');
      }
    },
    stopBot: async () => {
      try {
        await api.stopBot();
        set((state) => {
          if (state.dashboardData) state.dashboardData.botStatus = 'stopped';
        });
        toast.info('Bot stopped.');
      } catch (error) {
        console.error('Failed to stop bot', error);
        toast.error('Failed to stop bot.');
      }
    },
  }))
);