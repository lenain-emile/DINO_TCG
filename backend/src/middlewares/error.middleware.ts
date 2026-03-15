import type { NextFunction, Request, Response } from "express";
import { Prisma } from "../generated/prisma/client";
import { AppError } from "../lib/errors";

export function notFoundHandler(_req: Request, _res: Response, next: NextFunction): void {
  next(new AppError("Route not found", 404));
}

export function errorHandler(
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (process.env["NODE_ENV"] !== "production") {
    console.error("[API_ERROR]", error);
  }

  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      success: false,
      message: error.message,
    });
    return;
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
    res.status(409).json({
      success: false,
      message: "A unique field already exists",
      meta: error.meta,
    });
    return;
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    res.status(500).json({
      success: false,
      message: "Database request failed",
      code: error.code,
      meta: error.meta,
    });
    return;
  }

  if (error instanceof Prisma.PrismaClientInitializationError) {
    res.status(503).json({
      success: false,
      message: "Database is unavailable",
    });
    return;
  }

  if (error instanceof Error && process.env["NODE_ENV"] !== "production") {
    res.status(500).json({
      success: false,
      message: error.message,
    });
    return;
  }

  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
}
