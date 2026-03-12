import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma";

// Nombre de tours de hachage bcrypt : 12 est un bon équilibre sécurité/performance
const SALT_ROUNDS = 12;

// Durée de validité du token JWT : 7 jours
const JWT_EXPIRES_IN = "7d";

// ──────────────────────────────────────────────────────────────────────────────
// POST /api/auth/register
// Crée un compte utilisateur (Account) dans la base de données.
// Body attendu : { name, email, password }
// ──────────────────────────────────────────────────────────────────────────────
export async function register(req: Request, res: Response): Promise<void> {
  const { name, email, password } = req.body as {
    name?: unknown;
    email?: unknown;
    password?: unknown;
  };

  // ── Validation basique des entrées ───────────────────────────────────────
  if (
    typeof name !== "string" || name.trim() === "" ||
    typeof email !== "string" || email.trim() === "" ||
    typeof password !== "string" || password.length < 8
  ) {
    res.status(400).json({
      message:
        "Champs invalides. name et email sont requis, le mot de passe doit faire au moins 8 caractères.",
    });
    return;
  }

  // On normalise l'email en minuscules pour éviter les doublons de casse
  const normalizedEmail = email.trim().toLowerCase();

  // ── Vérification que l'email n'est pas déjà utilisé ─────────────────────
  const existing = await prisma.account.findUnique({
    where: { email: normalizedEmail },
  });
  if (existing) {
    res.status(409).json({ message: "Cet email est déjà utilisé." });
    return;
  }

  // ── Hachage du mot de passe ──────────────────────────────────────────────
  // On ne stocke JAMAIS le mot de passe en clair : bcrypt génère un hash salé.
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  // ── Création du compte en base ───────────────────────────────────────────
  const account = await prisma.account.create({
    data: {
      name: name.trim(),
      email: normalizedEmail,
      passwordHash,
    },
    // On sélectionne uniquement les champs sûrs à renvoyer au client
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });

  res.status(201).json({ message: "Compte créé avec succès.", account });
}

// ──────────────────────────────────────────────────────────────────────────────
// POST /api/auth/login
// Vérifie les identifiants et renvoie un token JWT si valides.
// Body attendu : { email, password }
// ──────────────────────────────────────────────────────────────────────────────
export async function login(req: Request, res: Response): Promise<void> {
  const { email, password } = req.body as {
    email?: unknown;
    password?: unknown;
  };

  // ── Validation basique des entrées ───────────────────────────────────────
  if (typeof email !== "string" || typeof password !== "string") {
    res.status(400).json({ message: "email et password sont requis." });
    return;
  }

  const normalizedEmail = email.trim().toLowerCase();

  // ── Recherche du compte ──────────────────────────────────────────────────
  const account = await prisma.account.findUnique({
    where: { email: normalizedEmail },
  });

  // Message volontairement générique pour ne pas révéler si l'email existe
  const INVALID_MSG = "Email ou mot de passe incorrect.";

  if (!account) {
    res.status(401).json({ message: INVALID_MSG });
    return;
  }

  // ── Comparaison du mot de passe ──────────────────────────────────────────
  const passwordMatch = await bcrypt.compare(password, account.passwordHash);
  if (!passwordMatch) {
    res.status(401).json({ message: INVALID_MSG });
    return;
  }

  // ── Génération du token JWT ──────────────────────────────────────────────
  const secret = process.env["JWT_SECRET"];
  if (!secret) {
    // Configuration manquante côté serveur : erreur 500
    res.status(500).json({ message: "Configuration serveur manquante." });
    return;
  }

  const token = jwt.sign(
    { sub: account.id, role: account.role },
    secret,
    { expiresIn: JWT_EXPIRES_IN }
  );

  res.status(200).json({
    message: "Connexion réussie.",
    token,
    account: {
      id: account.id,
      name: account.name,
      email: account.email,
      role: account.role,
    },
  });
}
