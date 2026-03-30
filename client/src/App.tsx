import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import IntroDino from './Intro-dino/intro'

function App() {
  const [count, setCount] = useState(0)

  // 1. État (State) pour savoir si on doit afficher l'intro
  // Mettre à "true" par défaut pour qu'elle s'affiche au lancement du site
  const [afficherIntro, setAfficherIntro] = useState(true)

  return (
    <>
      {/* 2. Affichage conditionnel de l'intro */}
      {afficherIntro && (
        <IntroDino 
          dureeEnMillisecondes={6000} // On fixe la durée ici de manière très lisible
          surIntroTerminee={() => setAfficherIntro(false)} // Quand l'intro dit "stop", on cache le composant
        />
      )}

      {/* 3. Le reste du jeu (qui fonctionnera en fond le temps de l'intro) */}
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
