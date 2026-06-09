import { useEffect, useState } from "react";
import { lireProfil } from "../services/compte";

// XP nécessaire pour passer un niveau (placeholder).
const XP_PAR_NIVEAU = 350;

export type Joueur = {
  name: string;
  level: number;
  nbCredit: number;
  xp: number;
};

// Boosters disponibles : faux pour l'instant (pas encore de route backend).
export const BOOSTERS = [
  { id: "dinomite", nom: "DinoMite", teinte: 18, edition: "ÉDITION FEU" },
  { id: "jurassic", nom: "Jurassic", teinte: 140, edition: "ÉDITION JUNGLE" },
  { id: "glacius", nom: "Glacius", teinte: 200, edition: "ÉDITION GLACE" },
];

// Compte à rebours de départ du booster gratuit (3h34).
const DEPART_SECONDES = 3 * 3600 + 34 * 60 + 27;

// Met en forme un compte à rebours : "03H : 34MIN : 27SEC".
export function formaterTemps(secondes: number): string {
  const h = Math.floor(secondes / 3600);
  const m = Math.floor((secondes % 3600) / 60);
  const s = secondes % 60;
  const deux = (n: number) => n.toString().padStart(2, "0");
  return `${deux(h)}H : ${deux(m)}MIN : ${deux(s)}SEC`;
}

export function useAccueil() {
  const [joueur, setJoueur] = useState<Joueur | null>(null);
  const [boosterActif, setBoosterActif] = useState(0);
  const [secondes, setSecondes] = useState(DEPART_SECONDES);

  // Charge le vrai joueur.
  useEffect(() => {
    lireProfil()
      .then((d) => setJoueur(d.gamers[0] ?? null))
      .catch(() => setJoueur(null));
  }, []);

  // Décrémente le compte à rebours.
  useEffect(() => {
    const id = window.setInterval(() => {
      setSecondes((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => window.clearInterval(id);
  }, []);

  const ratioXp = joueur ? Math.min(1, (joueur.xp % XP_PAR_NIVEAU) / XP_PAR_NIVEAU) : 0;

  return { joueur, boosterActif, setBoosterActif, secondes, ratioXp, XP_PAR_NIVEAU };
}
