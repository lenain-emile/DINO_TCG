import { useGLTF, useAnimations } from '@react-three/drei'
import { useEffect, useRef, useMemo } from 'react'
import { Group, Box3, Vector3 } from 'three'

export type ProprietesChargeurDino = {
  // Au lieu de deviner l'échelle manuellement, on lui donne la hauteur qu'on veut (en unités Three.js)
  hauteurCible?: number;
}

export default function ChargeurDino({ 
  hauteurCible = 3.5 
}: ProprietesChargeurDino) {
  
  const groupeRef = useRef<Group>(null)
  const { scene, animations } = useGLTF('/Model/dino_animated_character.glb')
  const { actions, names } = useAnimations(animations, groupeRef)

  // 1. Calcul automatique (très pro) pour que le Dino rentre TOUJOURS dans la caméra 
  // peu importe sa taille d'origine dans le fichier GLB.
  const reglageAutomatique = useMemo(() => {
    // On dessine une boite virtuelle autour du modèle actuel pour mesurer sa vraie taille
    const boite = new Box3().setFromObject(scene)
    const taille = boite.getSize(new Vector3())
    const centre = boite.getCenter(new Vector3())

    // On évite les erreurs mathématiques
    const hauteurReelle = taille.y > 0 ? taille.y : 1
    
    // Le calcul magique pour trouver la bonne "échelle"
    const echelle = hauteurCible / hauteurReelle

    // On calcule la position pour qu'il soit bien posé sur le sol (y=0) et au centre du monde (x=0, z=0)
    const positionX = -centre.x * echelle
    const positionY = -boite.min.y * echelle
    const positionZ = -centre.z * echelle

    return { echelle, position: [positionX, positionY, positionZ] as [number, number, number] }
  }, [scene, hauteurCible])

  // Lancement de l'animation...
  // Lancement de l'animation...
  useEffect(() => {
    // Si tu trouves que "bouger sur place c'est moche", on commente le .play() 
    // pour le laisser dans sa pose statique d'origine bien droit sur son skate.
    if (names.length === 0 || !actions) return

    const nomPremiereAnimation = names[0]
    const animationDino = actions[nomPremiereAnimation]

    // On stoppe l'animation pour le figer dans sa belle position de départ
    if (animationDino) {
      animationDino.reset().stop()
    }

    return () => {
      if (animationDino) {
        animationDino.stop()
      }
    }
  }, [actions, names])

  return (
    // On applique l'échelle, on corrige la position, et on le tourne pour avoir le même angle que sur ta photo
    <group 
      ref={groupeRef} 
      scale={reglageAutomatique.echelle} 
      position={reglageAutomatique.position}
      rotation={[0, Math.PI / 4, 0]} // Tourne le dino de 45 degrés pour le voir de 3/4 profil (comme ta photo)
    >
      <primitive object={scene} />
    </group>
  )
}

// Petit bonus "pro" : on précharge le modèle discrètement pour éviter des saccades au démarrage
useGLTF.preload('/Model/dino_animated_character.glb')
