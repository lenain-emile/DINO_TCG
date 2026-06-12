import { useState } from "react";
import { IconeAccueil, IconeCartes, IconeDecks, IconeCombat, IconeProfil } from "./Icones";
import "../styles/navbar.css";

// Onglets de la navbar. 'action' permet d'ouvrir un autre écran (ex: profil).
const ONGLETS = [
  { id: "accueil", label: "Accueil", Icone: IconeAccueil },
  { id: "cartes", label: "Cartes", Icone: IconeCartes },
  { id: "decks", label: "Decks", Icone: IconeDecks },
  { id: "combat", label: "Combat", Icone: IconeCombat },
  { id: "profil", label: "Profil", Icone: IconeProfil },
];

type Props = {
  onOuvrirProfil: () => void;
};

export default function Navbar({ onOuvrirProfil }: Props) {
  const [actif, setActif] = useState(0);

  function cliquer(index: number, id: string) {
    setActif(index);
    if (id === "profil") onOuvrirProfil();
  }

  return (
    <nav
      className="navbar"
      style={{ "--index": actif, "--total": ONGLETS.length } as React.CSSProperties}
    >
      {/* La bulle liquide qui glisse sous l'onglet actif */}
      <span className="navbar-bulle" />

      {ONGLETS.map((o, i) => (
        <button
          key={o.id}
          className={i === actif ? "navbar-bouton actif" : "navbar-bouton"}
          onClick={() => cliquer(i, o.id)}
        >
          <o.Icone className="navbar-icone" />
          <span className="navbar-label">{o.label}</span>
        </button>
      ))}
    </nav>
  );
}
