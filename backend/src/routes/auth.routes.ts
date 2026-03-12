import { Router } from "express";
import { login, register } from "../controllers/auth.controller";

// On crée un routeur Express dédié à l'authentification.
// Chaque handler est une fonction async : Express 5 propage automatiquement les
// erreurs des promesses rejetées, donc pas besoin de try/catch ici.
const router = Router();

// POST /api/auth/register — Inscription
router.post("/register", register);

// POST /api/auth/login — Connexion
router.post("/login", login);

export default router;
