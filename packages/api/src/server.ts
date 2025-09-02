import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { env } from "./env";
import { prettyJSON } from "hono/pretty-json";

// Import API routes
import { usersRouter } from "./routes/users";
import { postsRouter } from "./routes/posts";
import { categoriesRouter } from "./routes/categories";
import { authRouter } from "./routes/auth";

const app = new Hono();

// Middleware
app.use("*", logger());
app.use("*", prettyJSON());
app.use(
  "*",
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001"], // Next.js dev server + potential frontend
    allowMethods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

// Health check
app.get("/", (c) => {
  return c.json({
    message: "Hono API Server",
    status: "running",
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.route("/api/users", usersRouter);
app.route("/api/posts", postsRouter);
app.route("/api/categories", categoriesRouter);
app.route("/api/auth", authRouter);

// 404 handler
app.notFound((c) => {
  return c.json({ error: "Not Found" }, 404);
});

// Error handler
app.onError((err, c) => {
  console.error(err);
  return c.json({ error: "Internal Server Error" }, 500);
});

const port = env.HONO_PORT;

console.log(`🚀 Hono API Server running on http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port,
});
