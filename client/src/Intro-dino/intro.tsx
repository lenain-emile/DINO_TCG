import { Canvas } from '@react-three/fiber'
import { Suspense, useEffect } from 'react'
import type { WebGLRenderer } from 'three'
import ChargeurDino from './dino-load'

// 1. Définition des propriétés (Types en français)
export type ProprietesIntro = {
  // Fonction appelée par le parent (App.tsx) quand l'intro est terminée
  surIntroTerminee: () => void;
  // Durée totale de l'intro en millisecondes. Scalable (facile à changer depuis App.tsx)
  dureeEnMillisecondes?: number;
}

/**
 * Composant : IntroDino
 * Rôle : Gérer la caméra, la lumière et la scène 3D pour filmer le dinosaure.
 * C'est une intro stricte type "film", sans bouton, qui se coupe toute seule.
 */
export default function IntroDino({ 
  surIntroTerminee, 
  dureeEnMillisecondes = 9000 // Fin de l'intro après 9 secondes par défaut
}: ProprietesIntro) {

  // 2. Gestion du temps (Timer)
  useEffect(() => {
    // Dès l'affichage, on lance un chronomètre
    const chrono = setTimeout(() => {
      // Le temps imparti est écoulé, on prévient l'application de retirer l'intro
      surIntroTerminee()
    }, dureeEnMillisecondes)

    // Nettoyage de sécurité
    return () => clearTimeout(chrono)
  }, [surIntroTerminee, dureeEnMillisecondes])

  // 3. Rendu de la scène 3D
  return (
    // Conteneur vert en plein écran absolu (On utilise "style" pour forcer le plein écran passe outre les conflits de l'App)
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 9999, backgroundColor: 'Green' }}>
      {/* 
        Le Canvas (React Three Fiber).
        Camera reculée (z: 10) et un poil en hauteur (y: 3.5) pour voir le dino en entier
      */}
      <Canvas
        style={{ display: 'block', width: '100%', height: '100%' }}
        camera={{ position: [0, 3.5, 10], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: false }}
        onCreated={({ gl }: { gl: WebGLRenderer }) => {
          // On met un beau fond vert semblable à ta photo au lieu du noir complet
          gl.setClearColor('#4a8f5e', 1) 
        }}
      >
        {/* Lumières douces pour un rendu plus esthétique (sans ombres dures) */}
        <ambientLight intensity={2.0} />
        <directionalLight position={[5, 10, 5]} intensity={1.5} />
        <directionalLight position={[-5, 2, -5]} intensity={1.0} /> 
        
        {/* Suspense "met en pause" le rendu 3D le temps que le fichier .glb soit téléchargé */}
        <Suspense fallback={null}>
          <ChargeurDino hauteurCible={3.5} />
        </Suspense>
      </Canvas>
    </div>
  )
}
