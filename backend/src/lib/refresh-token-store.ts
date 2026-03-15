import crypto from "node:crypto";
import { env } from "../config/env";
import { hashToken } from "./auth";
import { prisma } from "./prisma";

export type RefreshTokenRecord = {
  id: string;
  accountId: string;
  tokenHash: string;
  expiresAt: Date;
  revokedAt: Date | null;
  replacedById: string | null;
  createdAt: Date;
};

type RefreshTokenRow = {
  id: string;
  account_id: string;
  token_hash: string;
  expires_at: Date;
  revoked_at: Date | null;
  replaced_by_id: string | null;
  created_at: Date;
};

function mapRow(row: RefreshTokenRow): RefreshTokenRecord {
  return {
    id: row.id,
    accountId: row.account_id,
    tokenHash: row.token_hash,
    expiresAt: row.expires_at,
    revokedAt: row.revoked_at,
    replacedById: row.replaced_by_id,
    createdAt: row.created_at,
  };
}

export function computeRefreshExpiry(): Date {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + env.refreshTokenDays);
  return expiresAt;
}

export function newRefreshTokenId(): string {
  return crypto.randomUUID();
}

export async function createRefreshTokenRecord(params: {
  id: string;
  accountId: string;
  token: string;
  expiresAt: Date;
}): Promise<void> {
  const tokenHash = hashToken(params.token);

  await prisma.$executeRaw`
    INSERT INTO refresh_token (id, account_id, token_hash, expires_at)
    VALUES (${params.id}::uuid, ${params.accountId}::uuid, ${tokenHash}, ${params.expiresAt}::timestamptz)
  `;
}

export async function findRefreshTokenRecordById(id: string): Promise<RefreshTokenRecord | null> {
  const rows = await prisma.$queryRaw<RefreshTokenRow[]>`
    SELECT id, account_id, token_hash, expires_at, revoked_at, replaced_by_id, created_at
    FROM refresh_token
    WHERE id = ${id}::uuid
    LIMIT 1
  `;

  const row = rows[0];
  if (!row) {
    return null;
  }

  return mapRow(row);
}

export async function revokeRefreshToken(params: {
  id: string;
  replacedById?: string;
}): Promise<void> {
  await prisma.$executeRaw`
    UPDATE refresh_token
    SET revoked_at = NOW(), replaced_by_id = ${params.replacedById ?? null}::uuid
    WHERE id = ${params.id}::uuid AND revoked_at IS NULL
  `;
}

export async function revokeAllRefreshTokensForAccount(accountId: string): Promise<void> {
  await prisma.$executeRaw`
    UPDATE refresh_token
    SET revoked_at = NOW()
    WHERE account_id = ${accountId}::uuid AND revoked_at IS NULL
  `;
}

export function doesRefreshTokenMatch(token: string, record: RefreshTokenRecord): boolean {
  return hashToken(token) === record.tokenHash;
}

export function isRefreshTokenActive(record: RefreshTokenRecord): boolean {
  return !record.revokedAt && record.expiresAt.getTime() > Date.now();
}
