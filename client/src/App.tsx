import { useState } from "react";
import "./App.css";
import IntroDino from "./Intro-dino/intro.tsx";
import Connexion from "./screens/Connexion.tsx";
import Accueil from "./screens/Accueil.tsx";
import Profil from "./screens/Profil.tsx";

type Screen = "home" | "game" | "profile";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000/api";

const HOME_VIDEO_SRC_MP4 = "/Model/Comp_1.mp4";
const HOME_VIDEO_OBJECT_POSITION = "85% 50%"; // cadrage: dino visible côté droit

function App() {
  // Intro : jouée une seule fois au démarrage.
  const [showIntro, setShowIntro] = useState(true);
  const [screen, setScreen] = useState<Screen>("home");

  async function handleLogout() {
    const refreshToken = localStorage.getItem("refreshToken");
    try {
      if (refreshToken) {
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken }),
        });
      }
    } catch {
      // logout best-effort : on nettoie côté client quoi qu'il arrive.
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      setScreen("home");
    }
  }

  if (showIntro) {
    return (
      <IntroDino
        dureeEnMillisecondes={6000}
        surIntroTerminee={() => setShowIntro(false)}
        mp4Src="/Model/Comp_1.mp4"
        src="/Model/Comp_1.mov"
        objectPosition="50% 50%"
      />
    );
  }

  if (screen === "profile") {
    return <Profil onRetour={() => setScreen("game")} />;
  }

  if (screen === "game") {
    return (
      <Accueil
        onDeconnexion={handleLogout}
        onOuvrirProfil={() => setScreen("profile")}
      />
    );
  }

  return (
    <Connexion
      videoSrc={HOME_VIDEO_SRC_MP4}
      videoPosition={HOME_VIDEO_OBJECT_POSITION}
      onConnecte={() => setScreen("game")}
    />
  );
}

export default App;
