import { useAccueil, formaterTemps } from "../hooks/useAccueil";
import Navbar from "../ui/Navbar";
import { IconeDeconnexion } from "../ui/Icones";
import "../styles/verre.css";
import "../styles/accueil.css";

type Props = {
  onDeconnexion: () => void;
  onOuvrirProfil: () => void;
};

export default function Accueil({ onDeconnexion, onOuvrirProfil }: Props) {
  const a = useAccueil();
  const booster = a.boosters[a.boosterActif];

  return (
    <main className="accueil">
      <div className="accueil-contenu">
        {/* En-tête joueur */}
        <header className="accueil-entete verre">
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
          <button className="accueil-deconnexion" onClick={onDeconnexion} aria-label="Déconnexion">
            <IconeDeconnexion className="accueil-deconnexion-icone" />
          </button>
        </header>

        {/* Boosters disponibles (vrais boosters du joueur) */}
        <h2 className="accueil-section-titre">BOOSTERS DISPONIBLES ({a.boosters.length})</h2>

        {booster ? (
          <>
            <div
              className="accueil-pack"
              style={{
                background: `radial-gradient(70% 60% at 50% 35%, hsl(${booster.teinte} 80% 45%), hsl(${booster.teinte} 70% 22%) 55%, #0a0f0c)`,
              }}
            >
              <p className="accueil-pack-edition">×{booster.quantite}</p>
              <p className="accueil-pack-nom" style={{ color: `hsl(${booster.teinte} 90% 88%)` }}>
                {booster.nom}
              </p>
              <span className="accueil-pack-dino">🦖</span>
            </div>

            <div className="accueil-points">
              {a.boosters.map((b, i) => (
                <button
                  key={b.id}
                  className={i === a.boosterActif ? "accueil-point actif" : "accueil-point"}
                  onClick={() => a.setBoosterActif(i)}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="accueil-pack accueil-pack-vide">
            <p>Aucun booster pour l’instant</p>
          </div>
        )}

        {/* Prochain booster gratuit */}
        <div className="accueil-timer verre">
          <p className="accueil-timer-label">PROCHAIN BOOSTER GRATUIT DANS</p>
          <p className="accueil-timer-valeur">{formaterTemps(a.secondes)}</p>
        </div>

        <button className="accueil-boutique">BOUTIQUE</button>
      </div>

      {/* Navigation bas avec bulle liquid glass */}
      <Navbar onOuvrirProfil={onOuvrirProfil} />
    </main>
  );
}
