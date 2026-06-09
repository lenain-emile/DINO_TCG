import { useEffect, useState } from "react";
import { lireProfil, modifierProfil } from "../services/compte";

// Logique de l'écran "Modifier le profil".
export function useProfil() {
  const [champs, setChamps] = useState({ pseudo: "", nom: "", email: "" });
  const [mdpActuel, setMdpActuel] = useState("");
  const [mdpNouveau, setMdpNouveau] = useState("");
  const [message, setMessage] = useState("");

  // Charge les valeurs réelles au montage.
  useEffect(() => {
    lireProfil()
      .then((d) =>
        setChamps({ pseudo: d.gamers[0]?.name ?? "", nom: d.nom, email: d.email }),
      )
      .catch((e) => setMessage(e.message));
  }, []);

  // Met à jour un champ du formulaire.
  function changer(cle: keyof typeof champs, valeur: string) {
    setChamps((c) => ({ ...c, [cle]: valeur }));
  }

  // Enregistre : on construit le body et on appelle l'API.
  async function enregistrer() {
    setMessage("");
    const body: Record<string, string> = {
      name: champs.nom,
      email: champs.email,
      gamerName: champs.pseudo,
    };
    if (mdpActuel && mdpNouveau) {
      body.currentPassword = mdpActuel;
      body.newPassword = mdpNouveau;
    }
    try {
      await modifierProfil(body);
      setMessage("Profil mis à jour.");
      setMdpActuel("");
      setMdpNouveau("");
    } catch (e) {
      setMessage((e as Error).message);
    }
  }

  return { champs, changer, mdpActuel, setMdpActuel, mdpNouveau, setMdpNouveau, message, enregistrer };
}
