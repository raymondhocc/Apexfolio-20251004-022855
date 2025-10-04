import { Hono } from "hono";
import { Env } from './core-utils';
import type { ApiResponse, BotSettings } from '@shared/types';
export function userRoutes(app: Hono<{ Bindings: Env }>) {
    app.get('/api/dashboard', async (c) => {
        const stub = c.env.GlobalDurableObject.get(c.env.GlobalDurableObject.idFromName("global"));
        const data = await stub.getDashboardData();
        return c.json({ success: true, data } satisfies ApiResponse<typeof data>);
    });
    app.get('/api/trades', async (c) => {
        const stub = c.env.GlobalDurableObject.get(c.env.GlobalDurableObject.idFromName("global"));
        const data = await stub.getTrades();
        return c.json({ success: true, data } satisfies ApiResponse<typeof data>);
    });
    app.get('/api/logs', async (c) => {
        const stub = c.env.GlobalDurableObject.get(c.env.GlobalDurableObject.idFromName("global"));
        const data = await stub.getLogs();
        return c.json({ success: true, data } satisfies ApiResponse<typeof data>);
    });
    app.post('/api/bot/start', async (c) => {
        const stub = c.env.GlobalDurableObject.get(c.env.GlobalDurableObject.idFromName("global"));
        await stub.setBotStatus('running');
        return c.json({ success: true, data: { status: 'started' } });
    });
    app.post('/api/bot/stop', async (c) => {
        const stub = c.env.GlobalDurableObject.get(c.env.GlobalDurableObject.idFromName("global"));
        await stub.setBotStatus('stopped');
        return c.json({ success: true, data: { status: 'stopped' } });
    });
    app.get('/api/settings', async (c) => {
        const stub = c.env.GlobalDurableObject.get(c.env.GlobalDurableObject.idFromName("global"));
        const data = await stub.getSettings();
        return c.json({ success: true, data } satisfies ApiResponse<typeof data>);
    });
    app.post('/api/settings', async (c) => {
        const settings = await c.req.json<BotSettings>();
        // Add validation here in a real app
        const stub = c.env.GlobalDurableObject.get(c.env.GlobalDurableObject.idFromName("global"));
        const data = await stub.updateSettings(settings);
        return c.json({ success: true, data } satisfies ApiResponse<typeof data>);
    });
}