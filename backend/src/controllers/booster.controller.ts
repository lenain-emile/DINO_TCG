import type { NextFunction, Request, Response } from "express";
import { AppError } from "../lib/errors";
import { prisma } from "../lib/prisma";

// ---------------------------------------------------------------------------
// Tire une rareté au sort selon les probabilités de la DB
// ---------------------------------------------------------------------------
function pickRarityId(rarities: { id: string; probability: unknown }[]): string {
  const roll = Math.random();
  let cumulative = 0;
  for (const r of rarities) {
    cumulative += Number(r.probability);
    if (roll <= cumulative) return r.id;
  }
  return rarities[rarities.length - 1].id; // fallback dernière rareté
}

/**
 * Récupère l'inventaire des boosters possédés par le joueur connecté.
 */
export async function getMyBoosters(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const accountId = req.auth?.sub;
    if (!accountId) {
      throw new AppError("Authentication required", 401);
    }

    // On récupère le profil Gamer (votre logique d'inscription crée un Gamer par Account)
    const gamer = await prisma.gamer.findFirst({
      where: { accountId },
      orderBy: { createdAt: "asc" },
      select: { id: true },
    });

    if (!gamer) {
      throw new AppError("Gamer profile not found", 404);
    }

    // On récupère les boosters avec une quantité > 0
    const inventory = await prisma.boosterDetained.findMany({
      where: {
        gamerId: gamer.id,
        quantity: { gt: 0 },
      },
      include: {
        booster: {
          select: {
            id: true,
            name: true,
            price: true,
            boosterType: true,
          },
        },
      },
      orderBy: {
        booster: { name: "asc" },
      },
    });

    // Gestion du cas "Aucun booster"
    if (inventory.length === 0) {
      res.status(200).json({
        success: true,
        message: "You do not have any boosters yet.",
        data: [],
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Booster inventory retrieved successfully.",
      data: inventory,
    });
  } catch (error) {
    return next(error);
  }
}

/**
 * POST /api/boosters/:boosterId/open
 * Ouvre un booster : tire 3 cartes selon les probabilités de rareté
 * et les ajoute à la collection du joueur.
 */
export async function openBooster(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const accountId = req.auth?.sub;
    if (!accountId) throw new AppError("Authentication required", 401);

    const { boosterId } = req.params;

    const gamer = await prisma.gamer.findFirst({
      where: { accountId },
      orderBy: { createdAt: "asc" },
      select: { id: true },
    });
    if (!gamer) throw new AppError("Gamer profile not found", 404);

    // Vérifier que le joueur possède ce booster (quantité > 0)
    const detained = await prisma.boosterDetained.findUnique({
      where: { gamerId_boosterId: { gamerId: gamer.id, boosterId } },
    });
    if (!detained || detained.quantity <= 0) {
      throw new AppError("You do not own this booster", 403);
    }

    // Charger le pool de cartes du booster avec leurs raretés
    const pool = await prisma.boosterCard.findMany({
      where: { boosterId },
      include: {
        card: {
          include: { rarity: true },
        },
      },
    });
    if (pool.length === 0) throw new AppError("This booster has no cards in its pool", 500);

    // Charger toutes les raretés pour le tirage
    const rarities = await prisma.rarity.findMany({
      orderBy: { probability: "desc" },
    });

    // Tirer 3 cartes
    const CARDS_PER_BOOSTER = 3;
    const drawnCards = [];

    for (let i = 0; i < CARDS_PER_BOOSTER; i++) {
      const targetRarityId = pickRarityId(rarities);

      // Filtrer le pool par rareté tirée
      let eligible = pool.filter((bc) => bc.card.rarityId === targetRarityId);

      // Fallback : si aucune carte de cette rareté dans le pool, prendre toutes les cartes
      if (eligible.length === 0) eligible = pool;

      const picked = eligible[Math.floor(Math.random() * eligible.length)];
      drawnCards.push(picked.card);
    }

    // Persister en transaction : décrémenter booster + ajouter cartes à la collection
    await prisma.$transaction(async (tx) => {
      await tx.boosterDetained.update({
        where: { gamerId_boosterId: { gamerId: gamer.id, boosterId } },
        data: { quantity: { decrement: 1 } },
      });

      for (const card of drawnCards) {
        await tx.playerCard.upsert({
          where: { gamerId_cardId: { gamerId: gamer.id, cardId: card.id } },
          create: { gamerId: gamer.id, cardId: card.id, quantity: 1 },
          update: { quantity: { increment: 1 } },
        });
      }
    });

    res.status(200).json({
      success: true,
      message: "Booster opened successfully!",
      data: drawnCards.map((c) => ({
        id: c.id,
        name: c.name,
        type: c.type,
        atk: c.atk,
        def: c.def,
        life: c.life,
        rarity: c.rarity.name,
      })),
    });
  } catch (error) {
    return next(error);
  }
}
