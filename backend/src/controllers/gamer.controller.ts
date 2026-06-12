import type { NextFunction, Request, Response } from "express";
import { AppError } from "../lib/errors";
import { prisma } from "../lib/prisma";

/**
 * Récupère le profil du joueur connecté (incluant nbCredit, xp, level, etc.)
 */
export async function getGamerProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const accountId = req.auth?.sub;
    if (!accountId) {
      throw new AppError("Authentication required", 401);
    }

    const gamer = await prisma.gamer.findFirst({
      where: { accountId },
      orderBy: { createdAt: "asc" },
    });

    if (!gamer) {
      throw new AppError("Gamer profile not found", 404);
    }

    res.status(200).json({
      success: true,
      message: "Gamer profile retrieved successfully.",
      data: gamer,
    });
  } catch (error) {
    return next(error);
  }
}

/**
 * Ajoute ou retire des crédits au joueur connecté.
 * Body attendu : { amount: number } (positif pour ajouter, négatif pour retirer)
 */
export async function updateGamerCredits(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const accountId = req.auth?.sub;
    if (!accountId) {
      throw new AppError("Authentication required", 401);
    }

    const { amount } = req.body;
    
    if (typeof amount !== 'number' || isNaN(amount)) {
      throw new AppError("Invalid amount provided. 'amount' must be a number.", 400);
    }

    const gamer = await prisma.gamer.findFirst({
      where: { accountId },
      orderBy: { createdAt: "asc" },
    });

    if (!gamer) {
      throw new AppError("Gamer profile not found", 404);
    }

    // Vérifier que le solde ne devient pas négatif en cas de retrait
    const newCreditBalance = gamer.nbCredit + amount;
    if (newCreditBalance < 0) {
      throw new AppError("Insufficient credits", 400);
    }

    const updatedGamer = await prisma.gamer.update({
      where: { id: gamer.id },
      data: {
        nbCredit: newCreditBalance,
      },
    });

    res.status(200).json({
      success: true,
      message: "Gamer credits updated successfully.",
      data: {
        nbCredit: updatedGamer.nbCredit,
      },
    });
  } catch (error) {
    return next(error);
  }
}
