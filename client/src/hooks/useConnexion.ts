import { useState } from "react";
import { connecter, inscrire } from "../services/compte";

// Logique de l'écran Connexion / Inscription.
export function useConnexion(onConnecte: () => void) {
  const [mode, setMode] = useState<"connexion" | "inscription">("connexion");
  const [pseudo, setPseudo] = useState("");
  const [email, setEmail] = useState("");
  const [mdp, setMdp] = useState("");
  const [erreur, setErreur] = useState("");
  const [enCours, setEnCours] = useState(false);

  // Bascule entre connexion et inscription.
  function changerMode(nouveau: "connexion" | "inscription") {
    setMode(nouveau);
    setErreur("");
  }

  async function valider() {
    setErreur("");
    if (mode === "inscription" && !pseudo.trim()) return setErreur("Le pseudo est requis.");
    if (!email.trim() || !mdp.trim()) return setErreur("Email et mot de passe requis.");

    setEnCours(true);
    try {
      if (mode === "inscription") {
        await inscrire(pseudo.trim(), email.trim().toLowerCase(), mdp.trim());
        changerMode("connexion"); // après inscription, on revient au login
        return;
      }
      await connecter(email.trim().toLowerCase(), mdp.trim());
      onConnecte();
    } catch (e) {
      setErreur((e as Error).message);
    } finally {
      setEnCours(false);
    }
  }

  return { mode, changerMode, pseudo, setPseudo, email, setEmail, mdp, setMdp, erreur, enCours, valider };
}
