import { Router } from "express";
import { getMyBoosters, openBooster } from "../controllers/booster.controller";
import { requireAuth } from "../middlewares/auth.middleware";

const router = Router();

/**
 * GET /api/boosters/inventory
 * Récupère les boosters possédés par l'utilisateur connecté.
 */
router.get("/inventory", requireAuth, getMyBoosters);

/**
 * POST /api/boosters/:boosterId/open
 * Ouvre un booster et retourne les 3 cartes tirées.
 */
router.post("/:boosterId/open", requireAuth, openBooster);

export { router as boosterRouter };
