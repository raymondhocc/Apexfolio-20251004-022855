import { DurableObject } from "cloudflare:workers";
import type { BotSettings, BotStatus, PortfolioSnapshot, Trade, DashboardData, LogEntry } from '@shared/types';
const STORAGE_KEYS = {
  SETTINGS: 'apexfolio_settings',
  STATUS: 'apexfolio_status',
  TRADES: 'apexfolio_trades',
  PORTFOLIO: 'apexfolio_portfolio',
  LOGS: 'apexfolio_logs',
};
const DEFAULT_SETTINGS: BotSettings = {
  strategy: 'momentum',
  riskPercentage: 1,
  targetAssets: ['AAPL', 'GOOGL', 'MSFT', 'AMZN'],
};
export class GlobalDurableObject extends DurableObject {
  async initializeIfNeeded(): Promise<void> {
    const status = await this.ctx.storage.get<BotStatus>(STORAGE_KEYS.STATUS);
    if (status) {
      return; // Already initialized
    }
    // Default Settings
    await this.ctx.storage.put(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
    // Default Status
    await this.ctx.storage.put(STORAGE_KEYS.STATUS, 'stopped');
    // Default Portfolio History
    const now = Date.now();
    const defaultPortfolio: PortfolioSnapshot[] = Array.from({ length: 30 }, (_, i) => ({
      timestamp: new Date(now - (29 - i) * 24 * 60 * 60 * 1000).toISOString(),
      value: 100000 + Math.sin(i / 5) * 5000 + Math.random() * 2000 - 1000,
    }));
    await this.ctx.storage.put(STORAGE_KEYS.PORTFOLIO, defaultPortfolio);
    // Default Trades
    const defaultTrades: Trade[] = Array.from({ length: 50 }, (_, i) => {
        const symbols = ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA', 'NVDA'];
        const symbol = symbols[Math.floor(Math.random() * symbols.length)];
        const action: 'buy' | 'sell' = Math.random() > 0.5 ? 'buy' : 'sell';
        const quantity = Math.floor(Math.random() * 20) + 1;
        const price = Math.random() * 200 + 100;
        return {
            id: `${i + 1}`,
            symbol,
            action,
            quantity,
            price,
            timestamp: new Date(now - i * 12 * 60 * 60 * 1000).toISOString(),
        };
    }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    await this.ctx.storage.put(STORAGE_KEYS.TRADES, defaultTrades);
    // Default Logs
    const defaultLogs: LogEntry[] = [
        { id: '1', timestamp: new Date(now - 1 * 60 * 1000).toISOString(), level: 'info', message: 'Bot initialized successfully.' },
        { id: '2', timestamp: new Date(now - 2 * 60 * 1000).toISOString(), level: 'info', message: 'Starting simulation...' },
        { id: '3', timestamp: new Date(now - 5 * 60 * 1000).toISOString(), level: 'warn', message: 'Market data feed latency detected: 150ms.' },
        { id: '4', timestamp: new Date(now - 10 * 60 * 1000).toISOString(), level: 'info', message: 'Executing trade: BUY 10 AAPL @ 175.20' },
        { id: '5', timestamp: new Date(now - 15 * 60 * 1000).toISOString(), level: 'error', message: 'Failed to execute trade for GOOGL: Insufficient simulated funds.' },
        { id: '6', timestamp: new Date(now - 20 * 60 * 1000).toISOString(), level: 'info', message: 'Settings updated: Risk percentage set to 1.5%.' },
    ];
    await this.ctx.storage.put(STORAGE_KEYS.LOGS, defaultLogs);
  }
  async getDashboardData(): Promise<DashboardData> {
    await this.initializeIfNeeded();
    const [portfolio, trades, status] = await Promise.all([
      this.ctx.storage.get<PortfolioSnapshot[]>(STORAGE_KEYS.PORTFOLIO),
      this.ctx.storage.get<Trade[]>(STORAGE_KEYS.TRADES),
      this.ctx.storage.get<BotStatus>(STORAGE_KEYS.STATUS),
    ]);
    const safePortfolio = portfolio ?? [];
    const safeTrades = trades ?? [];
    const safeStatus = status ?? 'stopped';
    const portfolioValue = safePortfolio.length > 0 ? safePortfolio[safePortfolio.length - 1].value : 0;
    const yesterdayValue = safePortfolio.length > 1 ? safePortfolio[safePortfolio.length - 2].value : portfolioValue;
    const firstValue = safePortfolio.length > 0 ? safePortfolio[0].value : 0;
    return {
      portfolioValue,
      todayPL: portfolioValue - yesterdayValue,
      totalPL: portfolioValue - firstValue,
      botStatus: safeStatus,
      performance: safePortfolio,
      recentTrades: safeTrades.slice(0, 5),
    };
  }
  async getTrades(): Promise<Trade[]> {
    await this.initializeIfNeeded();
    return (await this.ctx.storage.get<Trade[]>(STORAGE_KEYS.TRADES)) ?? [];
  }
  async getLogs(): Promise<LogEntry[]> {
    await this.initializeIfNeeded();
    return (await this.ctx.storage.get<LogEntry[]>(STORAGE_KEYS.LOGS)) ?? [];
  }
  async getSettings(): Promise<BotSettings> {
    await this.initializeIfNeeded();
    const settings = await this.ctx.storage.get<BotSettings>(STORAGE_KEYS.SETTINGS);
    return settings ?? DEFAULT_SETTINGS;
  }
  async updateSettings(settings: BotSettings): Promise<BotSettings> {
    await this.ctx.storage.put(STORAGE_KEYS.SETTINGS, settings);
    return settings;
  }
  async setBotStatus(status: BotStatus): Promise<void> {
    await this.ctx.storage.put(STORAGE_KEYS.STATUS, status);
  }
}