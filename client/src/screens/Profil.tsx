import { useProfil } from "../hooks/useProfil";
import "../styles/verre.css";
import "../styles/profil.css";

export default function Profil({ onRetour }: { onRetour: () => void }) {
  const p = useProfil();

  return (
    <main className="profil">
      <div className="profil-contenu">
        <div className="profil-titre">
          <button className="profil-retour" onClick={onRetour}>←</button>
          <h1>Modifier le profil</h1>
        </div>

        <div className="profil-bloc verre">
          <label className="profil-label">
            <span>Pseudo joueur</span>
            <input className="profil-champ" value={p.champs.pseudo}
              onChange={(e) => p.changer("pseudo", e.target.value)} />
          </label>
          <label className="profil-label">
            <span>Nom de compte</span>
            <input className="profil-champ" value={p.champs.nom}
              onChange={(e) => p.changer("nom", e.target.value)} />
          </label>
          <label className="profil-label">
            <span>Email</span>
            <input className="profil-champ" type="email" value={p.champs.email}
              onChange={(e) => p.changer("email", e.target.value)} />
          </label>
        </div>

        <div className="profil-bloc verre">
          <label className="profil-label">
            <span>Mot de passe actuel</span>
            <input className="profil-champ" type="password" value={p.mdpActuel}
              onChange={(e) => p.setMdpActuel(e.target.value)} />
          </label>
          <label className="profil-label">
            <span>Nouveau mot de passe</span>
            <input className="profil-champ" type="password" value={p.mdpNouveau}
              onChange={(e) => p.setMdpNouveau(e.target.value)} />
          </label>
        </div>

        <button className="profil-bouton" onClick={p.enregistrer}>Enregistrer</button>
        {p.message && <p className="profil-message">{p.message}</p>}
      </div>
    </main>
  );
}
