import { Router } from "express";
import { getGamerProfile, updateGamerCredits } from "../controllers/gamer.controller";
import { requireAuth } from "../middlewares/auth.middleware";

const router = Router();

/**
 * GET /api/gamer
 * Récupère le profil du joueur connecté (incluant ses crédits).
 */
router.get("/", requireAuth, getGamerProfile);

/**
 * PATCH /api/gamer/credits
 * Ajoute ou retire des crédits au joueur connecté.
 */
router.patch("/credits", requireAuth, updateGamerCredits);

export { router as gamerRouter };
