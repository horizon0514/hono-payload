import { db } from "./db/connection.js";
import { users } from "./db/schema/users.js";
import { eq } from "drizzle-orm";

async function main() {
  const email = "admin@example.com";
  const [existing] = await db.select().from(users).where(eq(users.email, email)).limit(1);
  if (existing) {
    console.log("seed: admin already exists");
    return;
  }
  await db.insert(users).values({
    email,
    name: "Admin",
    role: "admin",
    isActive: true,
  });
  console.log("seed: admin created", email);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

