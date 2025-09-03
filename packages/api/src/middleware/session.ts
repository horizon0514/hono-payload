import type { Context, Next } from "hono";
import { getSession } from "better-auth/api";
import { auth } from "@hono-payload/auth";

export type SessionData = {
  user?: unknown;
};

export async function withSession(c: Context, next: Next) {
  const res = await getSession(auth)({ request: c.req.raw });
  if (res?.user) {
    // attach user to context for downstream handlers
    c.set("user", res.user);
  }
  await next();
}

