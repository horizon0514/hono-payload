import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { prettyJSON } from 'hono/pretty-json';
// Import API routes
import { usersRouter } from './routes/users';
import { postsRouter } from './routes/posts';
import { categoriesRouter } from './routes/categories';
const app = new Hono();
// Middleware
app.use('*', logger());
app.use('*', prettyJSON());
app.use('*', cors({
    origin: ['http://localhost:3000', 'http://localhost:3001'], // Next.js dev server + potential frontend
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));
// Health check
app.get('/', (c) => {
    return c.json({
        message: 'Hono API Server',
        status: 'running',
        timestamp: new Date().toISOString(),
    });
});
// API Routes
app.route('/api/users', usersRouter);
app.route('/api/posts', postsRouter);
app.route('/api/categories', categoriesRouter);
// 404 handler
app.notFound((c) => {
    return c.json({ error: 'Not Found' }, 404);
});
// Error handler
app.onError((err, c) => {
    console.error(err);
    return c.json({ error: 'Internal Server Error' }, 500);
});
const port = Number(process.env.HONO_PORT) || 4000;
console.log(`🚀 Hono API Server running on http://localhost:${port}`);
serve({
    fetch: app.fetch,
    port,
});
