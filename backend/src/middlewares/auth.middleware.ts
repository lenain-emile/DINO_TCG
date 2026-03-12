import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// On étend le type Request d'Express pour pouvoir attacher les données
// décodées du token JWT à la requête et les utiliser dans les contrôleurs.
export interface AuthenticatedRequest extends Request {
  user?: { sub: string; role: string };
}

// ──────────────────────────────────────────────────────────────────────────────
// Middleware verifyToken
// Vérifie que la requête contient un token JWT valide dans le header
// Authorization (format : "Bearer <token>").
// Si le token est valide, on attache le payload décodé à req.user et on
// passe au middleware/contrôleur suivant. Sinon, on répond 401.
// ──────────────────────────────────────────────────────────────────────────────
export function verifyToken(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers["authorization"];

  // Le header doit être de la forme : "Bearer eyJhb..."
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ message: "Token manquant ou mal formé." });
    return;
  }

  const token = authHeader.slice(7); // retire "Bearer "

  const secret = process.env["JWT_SECRET"];
  if (!secret) {
    res.status(500).json({ message: "Configuration serveur manquante." });
    return;
  }

  try {
    const payload = jwt.verify(token, secret) as { sub: string; role: string };
    req.user = { sub: payload.sub, role: payload.role };
    next();
  } catch {
    res.status(401).json({ message: "Token invalide ou expiré." });
  }
}
