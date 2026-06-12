import { useConnexion } from "../hooks/useConnexion";
import VideoBackground from "../ui/VideoBackground";
import "../styles/verre.css";
import "../styles/connexion.css";

type Props = {
  videoSrc: string;
  videoPosition: string;
  onConnecte: () => void;
};

export default function Connexion({ videoSrc, videoPosition, onConnecte }: Props) {
  const c = useConnexion(onConnecte);
  const estInscription = c.mode === "inscription";

  return (
    <main className="connexion">
      <VideoBackground mp4Src={videoSrc} objectPosition={videoPosition} />

      <div className="connexion-contenu">
        <div className="connexion-panneau verre">
          <p className="connexion-marque">DINO TCG</p>
          <h1 className="connexion-titre">Début de partie</h1>

          <div className="connexion-onglets">
            <button
              className={!estInscription ? "connexion-onglet actif" : "connexion-onglet"}
              onClick={() => c.changerMode("connexion")}
            >
              Connexion
            </button>
            <button
              className={estInscription ? "connexion-onglet actif" : "connexion-onglet"}
              onClick={() => c.changerMode("inscription")}
            >
              Inscription
            </button>
          </div>

          {estInscription && (
            <label className="connexion-label">
              <span>Pseudo</span>
              <input className="connexion-champ" value={c.pseudo}
                onChange={(e) => c.setPseudo(e.target.value)} disabled={c.enCours} />
            </label>
          )}

          <label className="connexion-label">
            <span>Email</span>
            <input className="connexion-champ" type="email" value={c.email}
              onChange={(e) => c.setEmail(e.target.value)} disabled={c.enCours} />
          </label>

          <label className="connexion-label">
            <span>Mot de passe</span>
            <input className="connexion-champ" type="password" value={c.mdp}
              onChange={(e) => c.setMdp(e.target.value)} disabled={c.enCours} />
          </label>

          {c.erreur && <p className="connexion-erreur">{c.erreur}</p>}

          <button className="connexion-bouton" onClick={c.valider} disabled={c.enCours}>
            {c.enCours ? "…" : estInscription ? "Créer le compte" : "Entrer"}
          </button>
        </div>
      </div>
    </main>
  );
}
