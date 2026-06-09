import { useAccueil, formaterTemps, BOOSTERS } from "../hooks/useAccueil";
import "../styles/accueil.css";

type Props = {
  onDeconnexion: () => void;
  onOuvrirProfil: () => void;
};

const NAV = [
  { icone: "🏠", nom: "Accueil", actif: true },
  { icone: "🃏", nom: "Cartes", actif: false },
  { icone: "➕", nom: "Decks", actif: false },
  { icone: "⚔️", nom: "Combat", actif: false },
];

export default function Accueil({ onDeconnexion, onOuvrirProfil }: Props) {
  const a = useAccueil();
  const booster = BOOSTERS[a.boosterActif];

  return (
    <main className="accueil">
      <div className="accueil-contenu">
        {/* En-tête joueur */}
        <header className="accueil-entete">
          <div className="accueil-avatar">🦖</div>
          <div className="accueil-infos">
            <p className="accueil-pseudo">{a.joueur?.name ?? "…"}</p>
            <div className="accueil-niveau-ligne">
              <span className="accueil-niveau">nv.{a.joueur?.level ?? 1}</span>
              <div className="accueil-xp">
                <div className="accueil-xp-barre" style={{ width: `${a.ratioXp * 100}%` }} />
              </div>
              <span className="accueil-xp-texte">
                {(a.joueur?.xp ?? 0) % a.XP_PAR_NIVEAU}/{a.XP_PAR_NIVEAU}
              </span>
            </div>
          </div>
          <div className="accueil-credits">{a.joueur?.nbCredit ?? 0} 🪙</div>
        </header>

        {/* Boosters disponibles */}
        <h2 className="accueil-section-titre">BOOSTERS DISPONIBLES ({BOOSTERS.length})</h2>
        <div
          className="accueil-pack"
          style={{
            background: `radial-gradient(70% 60% at 50% 35%, hsl(${booster.teinte} 80% 45%), hsl(${booster.teinte} 70% 22%) 55%, #0a0f0c)`,
          }}
        >
          <p className="accueil-pack-edition">{booster.edition}</p>
          <p className="accueil-pack-nom" style={{ color: `hsl(${booster.teinte} 90% 88%)` }}>
            {booster.nom}
          </p>
          <span className="accueil-pack-dino">🦖</span>
        </div>

        <div className="accueil-points">
          {BOOSTERS.map((b, i) => (
            <button
              key={b.id}
              className={i === a.boosterActif ? "accueil-point actif" : "accueil-point"}
              onClick={() => a.setBoosterActif(i)}
            />
          ))}
        </div>

        {/* Prochain booster gratuit */}
        <div className="accueil-timer">
          <p className="accueil-timer-label">PROCHAIN BOOSTER GRATUIT DANS</p>
          <p className="accueil-timer-valeur">{formaterTemps(a.secondes)}</p>
        </div>

        <button className="accueil-boutique">BOUTIQUE</button>
      </div>

      {/* Navigation bas */}
      <nav className="accueil-nav">
        {NAV.map((item) => (
          <button key={item.nom} className={item.actif ? "accueil-nav-bouton actif" : "accueil-nav-bouton"}>
            {item.icone}
          </button>
        ))}
        <button className="accueil-nav-bouton" onClick={onOuvrirProfil}>👤</button>
        <button className="accueil-nav-bouton" onClick={onDeconnexion}>⎋</button>
      </nav>
    </main>
  );
}
