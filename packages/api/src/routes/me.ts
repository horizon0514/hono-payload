import { Hono } from "hono";

export const meRouter = new Hono();

meRouter.get("/", (c) => {
  const user = c.get("user");
  if (!user) {
    return c.json({ success: false, error: "Unauthorized" }, 401);
  }
  return c.json({ success: true, data: user });
});

