import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { users } from "@/db/schema/users";

import * as dotenv from "dotenv";
import { usersSeeding } from "./users";
import { hashPassword } from "@/lib/functions/server/password";
dotenv.config();

if (!("DATABASE_URL" in process.env))
  throw new Error("DATABASE_URL not found on .env");

const main = async () => {
  const client = new Pool({
    connectionString: process.env.DATABASE_URL,
  });
  const db = drizzle(client);

  const data = await Promise.all(
    usersSeeding.map(async (user) => ({
      ...user,
      password: await hashPassword(user.password),
    }))
  );

  console.log("Seed start");
  await db.insert(users).values(data);
  console.log("Seed done");
};

main();
