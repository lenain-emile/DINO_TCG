import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { PrismaClient } from "../generated/prisma/client";
import { env } from "../config/env";

declare global {
  // eslint-disable-next-line no-var
  var __prismaClient: PrismaClient | undefined;
}

const pool = new Pool({
  connectionString: env.databaseUrl,
});

const adapter = new PrismaPg(pool);

export const prisma =
  globalThis.__prismaClient ??
  new PrismaClient({
    adapter,
  });

if (process.env["NODE_ENV"] !== "production") {
  globalThis.__prismaClient = prisma;
}
