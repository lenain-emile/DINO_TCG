import type { NextFunction, Request, Response } from "express";
import { AppError } from "../lib/errors";
import { prisma } from "../lib/prisma";

// Renvoie les boosters détenus par le joueur connecté (table booster_detained).
export async function getMyBoosters(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const accountId = req.auth?.sub;
    if (!accountId) {
      throw new AppError("Authentication required", 401);
    }

    // On récupère le gamer lié au compte (le premier créé).
    const gamer = await prisma.gamer.findFirst({
      where: { accountId },
      orderBy: { createdAt: "asc" },
      select: { id: true },
    });

    if (!gamer) {
      throw new AppError("Gamer profile not found", 404);
    }

    const detained = await prisma.boosterDetained.findMany({
      where: { gamerId: gamer.id, quantity: { gt: 0 } },
      select: {
        quantity: true,
        booster: {
          select: { id: true, name: true, price: true },
        },
      },
    });

    // On aplatit pour le front : { id, name, price, quantity }.
    const boosters = detained.map((d) => ({
      id: d.booster.id,
      name: d.booster.name,
      price: d.booster.price,
      quantity: d.quantity,
    }));

    res.status(200).json({
      success: true,
      data: boosters,
    });
  } catch (error) {
    return next(error);
  }
}
