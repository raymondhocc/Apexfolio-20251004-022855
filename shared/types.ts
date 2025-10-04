import { z } from 'zod';
export type BotStatus = 'running' | 'stopped' | 'error';
export type Strategy = 'momentum' | 'mean_reversion' | 'arbitrage';
export const BotSettingsSchema = z.object({
  strategy: z.enum(['momentum', 'mean_reversion', 'arbitrage']),
  riskPercentage: z.coerce.number().min(0.1, "Risk must be at least 0.1%").max(10, "Risk cannot exceed 10%"),
  targetAssets: z.string().min(1, "At least one asset is required").transform(val => val.split(',').map(s => s.trim().toUpperCase()).filter(Boolean)).refine(arr => arr.length > 0, { message: "At least one asset is required" }),
});
export type BotSettings = z.infer<typeof BotSettingsSchema>;
export interface Trade {
  id: string;
  symbol: string;
  action: 'buy' | 'sell';
  quantity: number;
  price: number;
  timestamp: string;
}
export interface PortfolioSnapshot {
  timestamp: string;
  value: number;
}
export interface LogEntry {
    id: string;
    timestamp: string;
    level: 'info' | 'warn' | 'error';
    message: string;
}
export interface DashboardData {
  portfolioValue: number;
  todayPL: number;
  totalPL: number;
  botStatus: BotStatus;
  performance: PortfolioSnapshot[];
  recentTrades: Trade[];
}
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}