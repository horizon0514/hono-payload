import { Hono } from "hono";
import { auth } from "@hono-payload/auth";

export const authRouter = new Hono();

authRouter.all("/*", async (c) => {
  const req = c.req.raw;
  // better-auth exposes a fetch-compatible handler
  const res = "handler" in (auth as any) ? await (auth as any).handler(req) : await (auth as any)(req);
  return res as Response;
});

