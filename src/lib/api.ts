import type { ApiResponse, DashboardData, Trade, BotSettings, LogEntry } from '@shared/types';
async function fetcher<T>(url: string, options?: RequestInit): Promise<T> {
  try {
    const res = await fetch(url, options);
    if (!res.ok) {
      throw new Error(`API error: ${res.statusText}`);
    }
    const payload: ApiResponse<T> = await res.json();
    if (!payload.success || payload.data === undefined) {
      throw new Error(payload.error || 'API request failed');
    }
    return payload.data;
  } catch (error) {
    console.error(`[API Client] Fetch error for ${url}:`, error);
    throw error;
  }
}
export const api = {
  getDashboardData: (): Promise<DashboardData> => fetcher<DashboardData>('/api/dashboard'),
  getTrades: (): Promise<Trade[]> => fetcher<Trade[]>('/api/trades'),
  getSettings: (): Promise<BotSettings> => fetcher<BotSettings>('/api/settings'),
  getLogs: (): Promise<LogEntry[]> => fetcher<LogEntry[]>('/api/logs'),
  startBot: (): Promise<{ status: string }> => fetcher('/api/bot/start', { method: 'POST' }),
  stopBot: (): Promise<{ status: string }> => fetcher('/api/bot/stop', { method: 'POST' }),
  updateSettings: (settings: BotSettings): Promise<BotSettings> =>
    fetcher<BotSettings>('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    }),
};