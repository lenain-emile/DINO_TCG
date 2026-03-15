import dotenv from "dotenv";

dotenv.config();

function requiredEnv(name: string): string {
  const value = process.env[name];

  if (!value || value.trim().length === 0) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

function parseInteger(value: string | undefined, fallback: number): number {
  if (!value || value.trim().length === 0) {
    return fallback;
  }

  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? fallback : parsed;
}

export const env = {
  port: parseInteger(process.env["PORT"], 3000),
  databaseUrl: requiredEnv("DATABASE_URL"),
  jwtSecret: requiredEnv("JWT_SECRET"),
  jwtExpiresIn: process.env["JWT_EXPIRES_IN"] ?? "7d",
  refreshTokenSecret: requiredEnv("REFRESH_TOKEN_SECRET"),
  refreshTokenExpiresIn: process.env["REFRESH_TOKEN_EXPIRES_IN"] ?? "30d",
  refreshTokenDays: parseInteger(process.env["REFRESH_TOKEN_DAYS"], 30),
  bcryptRounds: parseInteger(process.env["BCRYPT_SALT_ROUNDS"], 12),
};
