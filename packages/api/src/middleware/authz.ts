import type { Context, Next } from "hono";

export async function requireAuth(c: Context, next: Next) {
  const user = c.get("user");
  if (!user) return c.json({ error: "Unauthorized" }, 401);
  await next();
}

export function requireRole(role: string) {
  return async (c: Context, next: Next) => {
    const user: any = c.get("user");
    if (!user) return c.json({ error: "Unauthorized" }, 401);
    if (!user.role || user.role !== role) return c.json({ error: "Forbidden" }, 403);
    await next();
  };
}

