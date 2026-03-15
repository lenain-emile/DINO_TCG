import type { NextFunction, Request, Response } from "express";
import { Prisma } from "../generated/prisma/client";
import {
  hashPassword,
  signAccessToken,
  signRefreshToken,
  verifyPassword,
  verifyRefreshToken,
} from "../lib/auth";
import { AppError } from "../lib/errors";
import { prisma } from "../lib/prisma";
import {
  computeRefreshExpiry,
  createRefreshTokenRecord,
  doesRefreshTokenMatch,
  findRefreshTokenRecordById,
  isRefreshTokenActive,
  newRefreshTokenId,
  revokeAllRefreshTokensForAccount,
  revokeRefreshToken,
} from "../lib/refresh-token-store";

type RegisterBody = {
  name?: string;
  email?: string;
  password?: string;
};

type LoginBody = {
  email?: string;
  password?: string;
};

type UpdateProfileBody = {
  name?: string;
  email?: string;
  gamerName?: string;
  currentPassword?: string;
  newPassword?: string;
};

type RefreshBody = {
  refreshToken?: string;
};

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function sanitizeName(name: string): string {
  return name.trim();
}

export async function register(req: Request<unknown, unknown, RegisterBody>, res: Response, next: NextFunction): Promise<void> {
  try {
    const name = req.body.name ? sanitizeName(req.body.name) : "";
    const email = req.body.email ? normalizeEmail(req.body.email) : "";
    const password = req.body.password?.trim() ?? "";

    if (!name || !email || !password) {
      throw new AppError("name, email and password are required", 400);
    }

    const existingAccount = await prisma.account.findUnique({
      where: { email },
      select: { id: true },
    });

    if (existingAccount) {
      throw new AppError("Email is already taken", 409);
    }

    const passwordHash = await hashPassword(password);

    const account = await prisma.account.create({
      data: {
        name,
        email,
        passwordHash,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    await prisma.gamer.create({
      data: {
        accountId: account.id,
        name,
      },
    });

    res.status(201).json({
      success: true,
      message: "Account created successfully",
      redirectTo: "/login",
      data: account,
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return next(new AppError("Email is already taken", 409));
    }
    return next(error);
  }
}

export async function login(req: Request<unknown, unknown, LoginBody>, res: Response, next: NextFunction): Promise<void> {
  try {
    const email = req.body.email ? normalizeEmail(req.body.email) : "";
    const password = req.body.password?.trim() ?? "";

    if (!email || !password) {
      throw new AppError("email and password are required", 400);
    }

    const account = await prisma.account.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        role: true,
        name: true,
        passwordHash: true,
      },
    });

    if (!account) {
      throw new AppError("Invalid email or password", 401);
    }

    const isPasswordValid = await verifyPassword(password, account.passwordHash);
    if (!isPasswordValid) {
      throw new AppError("Invalid email or password", 401);
    }

    const token = signAccessToken({
      sub: account.id,
      email: account.email,
      role: account.role,
    });

    const refreshId = newRefreshTokenId();
    const refreshToken = signRefreshToken({
      sub: account.id,
      jti: refreshId,
      type: "refresh",
    });

    await createRefreshTokenRecord({
      id: refreshId,
      accountId: account.id,
      token: refreshToken,
      expiresAt: computeRefreshExpiry(),
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      redirectTo: "/",
      data: {
        token,
        accessToken: token,
        refreshToken,
        user: {
          id: account.id,
          name: account.name,
          email: account.email,
          role: account.role,
        },
      },
    });
  } catch (error) {
    return next(error);
  }
}

export async function refreshSession(
  req: Request<unknown, unknown, RefreshBody>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const rawToken = req.body.refreshToken;
    const refreshToken = typeof rawToken === "string" ? rawToken.trim() : "";

    if (!refreshToken) {
      throw new AppError("refreshToken is required", 400);
    }

    let payload;
    try {
      payload = verifyRefreshToken(refreshToken);
    } catch {
      throw new AppError("Invalid refresh token", 401);
    }

    const currentRecord = await findRefreshTokenRecordById(payload.jti);
    if (!currentRecord || currentRecord.accountId !== payload.sub) {
      throw new AppError("Invalid refresh token", 401);
    }

    if (!isRefreshTokenActive(currentRecord)) {
      throw new AppError("Refresh token expired or revoked", 401);
    }

    if (!doesRefreshTokenMatch(refreshToken, currentRecord)) {
      await revokeAllRefreshTokensForAccount(payload.sub);
      throw new AppError("Invalid refresh token", 401);
    }

    const account = await prisma.account.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    if (!account) {
      throw new AppError("Account not found", 404);
    }

    const nextRefreshId = newRefreshTokenId();
    const nextRefreshToken = signRefreshToken({
      sub: account.id,
      jti: nextRefreshId,
      type: "refresh",
    });

    await createRefreshTokenRecord({
      id: nextRefreshId,
      accountId: account.id,
      token: nextRefreshToken,
      expiresAt: computeRefreshExpiry(),
    });

    await revokeRefreshToken({
      id: currentRecord.id,
      replacedById: nextRefreshId,
    });

    const accessToken = signAccessToken({
      sub: account.id,
      email: account.email,
      role: account.role,
    });

    res.status(200).json({
      success: true,
      message: "Session refreshed",
      data: {
        token: accessToken,
        accessToken,
        refreshToken: nextRefreshToken,
        user: {
          id: account.id,
          name: account.name,
          email: account.email,
          role: account.role,
        },
      },
    });
  } catch (error) {
    return next(error);
  }
}

export async function logout(req: Request<unknown, unknown, RefreshBody>, res: Response, next: NextFunction): Promise<void> {
  try {
    const rawToken = req.body.refreshToken;
    const refreshToken = typeof rawToken === "string" ? rawToken.trim() : "";

    if (!refreshToken) {
      throw new AppError("refreshToken is required", 400);
    }

    let payload;
    try {
      payload = verifyRefreshToken(refreshToken);
    } catch {
      throw new AppError("Invalid refresh token", 401);
    }

    const currentRecord = await findRefreshTokenRecordById(payload.jti);
    if (currentRecord && currentRecord.accountId === payload.sub) {
      await revokeRefreshToken({ id: currentRecord.id });
    }

    res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    return next(error);
  }
}

export async function getMyProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const accountId = req.auth?.sub;
    if (!accountId) {
      throw new AppError("Authentication required", 401);
    }

    const account = await prisma.account.findUnique({
      where: { id: accountId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        gamers: {
          orderBy: { createdAt: "asc" },
          select: {
            id: true,
            name: true,
            level: true,
            nbCredit: true,
            xp: true,
            createdAt: true,
          },
        },
      },
    });

    if (!account) {
      throw new AppError("Account not found", 404);
    }

    res.status(200).json({
      success: true,
      data: account,
    });
  } catch (error) {
    return next(error);
  }
}

export async function updateMyProfile(
  req: Request<unknown, unknown, UpdateProfileBody>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const accountId = req.auth?.sub;
    if (!accountId) {
      throw new AppError("Authentication required", 401);
    }

    const currentAccount = await prisma.account.findUnique({
      where: { id: accountId },
      select: { id: true, passwordHash: true },
    });

    if (!currentAccount) {
      throw new AppError("Account not found", 404);
    }

    const accountData: { name?: string; email?: string; passwordHash?: string } = {};
    const gamerName = req.body.gamerName?.trim();

    if (typeof req.body.name === "string") {
      const name = sanitizeName(req.body.name);
      if (!name) {
        throw new AppError("name cannot be empty", 400);
      }
      accountData.name = name;
    }

    if (typeof req.body.email === "string") {
      const email = normalizeEmail(req.body.email);
      if (!email) {
        throw new AppError("email cannot be empty", 400);
      }

      const existingByEmail = await prisma.account.findUnique({
        where: { email },
        select: { id: true },
      });

      if (existingByEmail && existingByEmail.id !== accountId) {
        throw new AppError("Email is already taken", 409);
      }

      accountData.email = email;
    }

    const hasPasswordUpdateInput =
      typeof req.body.currentPassword === "string" || typeof req.body.newPassword === "string";

    if (hasPasswordUpdateInput) {
      const currentPassword = req.body.currentPassword?.trim() ?? "";
      const newPassword = req.body.newPassword?.trim() ?? "";

      if (!currentPassword || !newPassword) {
        throw new AppError("currentPassword and newPassword are required to change password", 400);
      }

      const isCurrentPasswordValid = await verifyPassword(currentPassword, currentAccount.passwordHash);
      if (!isCurrentPasswordValid) {
        throw new AppError("Current password is invalid", 401);
      }

      accountData.passwordHash = await hashPassword(newPassword);
    }

    if (Object.keys(accountData).length === 0 && gamerName === undefined) {
      throw new AppError("No profile field to update", 400);
    }

    if (Object.keys(accountData).length > 0) {
      await prisma.account.update({
        where: { id: accountId },
        data: accountData,
      });
    }

    if (gamerName !== undefined) {
      if (!gamerName) {
        throw new AppError("gamerName cannot be empty", 400);
      }

      const existingGamer = await prisma.gamer.findFirst({
        where: { accountId },
        orderBy: { createdAt: "asc" },
        select: { id: true },
      });

      if (existingGamer) {
        await prisma.gamer.update({
          where: { id: existingGamer.id },
          data: { name: gamerName },
        });
      } else {
        throw new AppError("Gamer profile not found for this account", 404);
      }
    }

    const updated = await prisma.account.findUnique({
      where: { id: accountId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        gamers: {
          orderBy: { createdAt: "asc" },
          select: {
            id: true,
            name: true,
            level: true,
            nbCredit: true,
            xp: true,
            createdAt: true,
          },
        },
      },
    });

    res.status(200).json({
      success: true,
      message: "Profile updated",
      data: updated,
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return next(new AppError("A unique field value already exists", 409));
    }
    return next(error);
  }
}
