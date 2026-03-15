import type { NextFunction, Request, Response } from "express";
import { AppError } from "../lib/errors";
import { verifyAccessToken } from "../lib/auth";

export function requireAuth(req: Request, _res: Response, next: NextFunction): void {
  const authorization = req.headers["authorization"];

  if (!authorization) {
    return next(new AppError("Authentication required", 401));
  }

  const [scheme, token] = authorization.split(" ");

  if (scheme !== "Bearer" || !token) {
    return next(new AppError("Invalid authorization format", 401));
  }

  try {
    req.auth = verifyAccessToken(token);
    return next();
  } catch {
    return next(new AppError("Invalid or expired token", 401));
  }
}
