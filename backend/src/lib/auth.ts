import bcrypt from "bcryptjs";
import crypto from "node:crypto";
import jwt, { type SignOptions } from "jsonwebtoken";
import { env } from "../config/env";

export type AuthTokenPayload = {
  sub: string;
  email: string;
  role: string;
};

export async function hashPassword(plainPassword: string): Promise<string> {
  return bcrypt.hash(plainPassword, env.bcryptRounds);
}

export async function verifyPassword(plainPassword: string, passwordHash: string): Promise<boolean> {
  return bcrypt.compare(plainPassword, passwordHash);
}

export function signAccessToken(payload: AuthTokenPayload): string {
  const expiresIn: SignOptions["expiresIn"] = env.jwtExpiresIn as SignOptions["expiresIn"];
  return jwt.sign(payload, env.jwtSecret, { expiresIn } as SignOptions);
}

export function verifyAccessToken(token: string): AuthTokenPayload {
  return jwt.verify(token, env.jwtSecret) as AuthTokenPayload;
}

export type RefreshTokenPayload = {
  sub: string;
  jti: string;
  type: "refresh";
};

export function signRefreshToken(payload: RefreshTokenPayload): string {
  const expiresIn: SignOptions["expiresIn"] = env.refreshTokenExpiresIn as SignOptions["expiresIn"];
  return jwt.sign(payload, env.refreshTokenSecret, { expiresIn } as SignOptions);
}

export function verifyRefreshToken(token: string): RefreshTokenPayload {
  const decoded = jwt.verify(token, env.refreshTokenSecret) as RefreshTokenPayload;

  if (decoded.type !== "refresh" || !decoded.jti || !decoded.sub) {
    throw new Error("Invalid refresh token payload");
  }

  return decoded;
}

export function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}
