/**
 * DIAGNOSTIC ONLY — read-only. Does not create, update, or delete anything.
 *
 * Run with: npx ts-node --transpile-only -r tsconfig-paths/register src/scripts/diagnose-auth.ts
 * (from the backend/ directory, with a real .env pointing at your live MongoDB)
 *
 * Purpose: directly answers "do the stored password hashes for manager/staff/
 * customer actually correspond to 'Demo1234'?" using the app's real
 * comparePassword() (bcrypt) — not an assumption from reading seed.ts.
 */
import { connectDatabase, disconnectDatabase } from "@/database/connect";
import { comparePassword } from "@/utils/password";
import { User } from "@/models/User.model";
import { env } from "@/config/env";

const ACCOUNTS_TO_CHECK: { label: string; email: string; expectedPassword: string }[] = [
  { label: "Admin", email: env.admin.seedEmail, expectedPassword: env.admin.seedPassword },
  { label: "Manager", email: "manager@mrsk-eatries.com", expectedPassword: "Demo1234" },
  { label: "Staff", email: "staff@mrsk-eatries.com", expectedPassword: "Demo1234" },
  { label: "Demo Customer", email: "demo@mrsk-eatries.com", expectedPassword: "Demo1234" },
];

async function main() {
  await connectDatabase();
  console.log("\n[diagnose-auth] Connected. Checking stored User documents…\n");

  for (const account of ACCOUNTS_TO_CHECK) {
    const user = await User.findOne({ email: account.email.toLowerCase() }).select("+password");

    if (!user) {
      console.log(`[${account.label}] ❌ NOT FOUND — no User document exists for "${account.email}"`);
      console.log("");
      continue;
    }

    console.log(`[${account.label}]`);
    console.log(`  email in DB:      "${user.email}"`);
    console.log(`  role in DB:       "${user.role}"`);
    console.log(`  isActive in DB:   ${user.isActive}`);
    console.log(`  isEmailVerified:  ${user.isEmailVerified}`);
    console.log(`  password hash:    ${user.password ? user.password.slice(0, 7) + "…" + user.password.slice(-6) : "(none — password field missing!)"}`);
    console.log(`  hash length:      ${user.password?.length ?? 0} (a real bcrypt hash is always 60 chars)`);
    console.log(`  hash prefix ok:   ${user.password?.startsWith("$2") ?? false} (bcrypt hashes start with $2a$/$2b$/$2y$)`);

    if (user.password) {
      const matches = await comparePassword(account.expectedPassword, user.password);
      console.log(
        `  comparePassword("${account.expectedPassword}", storedHash) → ${matches ? "✅ MATCH" : "❌ NO MATCH"}`
      );
    }
    console.log("");
  }

  await disconnectDatabase();
  process.exit(0);
}

main().catch((error) => {
  console.error("[diagnose-auth] Failed:", error);
  process.exit(1);
});
