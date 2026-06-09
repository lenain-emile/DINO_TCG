import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Intro vidéo plein écran (cutscene).
 *
 * Objectifs :
 * - Remplacer totalement l’intro 3D (pas de WebGL, donc moins de bugs/perf).
 * - Lecture automatique quand c’est possible.
 * - Fin automatique : soit à la fin de la vidéo, soit via un timeout de sécurité.
 * - Contrôle du cadrage ("angle de vue") via `object-position`.
 */

export type IntroVideoProps = {
  /** Callback appelé quand l'intro doit disparaître. */
  onDone: () => void;

  /** Timeout de sécurité (ms) si la vidéo ne se lance pas ou ne déclenche pas 'ended'. */
  maxDurationMs?: number;

  /** Chemin public de la vidéo (fichier dans `client/public`). */
  src?: string;

  /** Optionnel: version MP4 (recommandée pour Chrome/Firefox/Edge). */
  mp4Src?: string;

  /** Optionnel: version WebM (encore plus compatible/perf selon navigateur). */
  webmSrc?: string;

  /** Cadrage CSS : ex "50% 50%" (centre), "50% 35%" (plus haut), etc. */
  view?: string;

  /** Vitesse de lecture de la vidéo (1 = normal). */
  rate?: number;
};

// Backward-compat : App.tsx importe encore `IntroDino`.
export type ProprietesIntro = {
  surIntroTerminee: () => void;
  dureeEnMillisecondes?: number;
  src?: string;
  mp4Src?: string;
  webmSrc?: string;
  objectPosition?: string;
  playbackRate?: number;
};

export default function IntroDino({
  surIntroTerminee,
  dureeEnMillisecondes = 9000,
  // Fallback si jamais MP4 ne se charge pas (rare)
  src = "/Model/Comp_1.mov",
  // Source principale (compatible Chrome/Firefox/Edge)
  mp4Src = "/Model/Comp_1.mp4",
  webmSrc,
  objectPosition = "50% 50%",
  playbackRate = 1,
}: ProprietesIntro) {
  return (
    <IntroVideo
      onDone={surIntroTerminee}
      maxDurationMs={dureeEnMillisecondes}
      src={src}
      mp4Src={mp4Src}
      webmSrc={webmSrc}
      view={objectPosition}
      rate={playbackRate}
    />
  );
}

function IntroVideo({
  onDone,
  maxDurationMs = 9000,
  src = "/Model/Comp_1.mov",
  mp4Src,
  webmSrc,
  view = "50% 50%",
  rate = 1,
}: IntroVideoProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const doneOnceRef = useRef(false);
  const [videoError, setVideoError] = useState(false);

  const finish = useCallback(() => {
    if (doneOnceRef.current) return;
    doneOnceRef.current = true;
    onDone();
  }, [onDone]);

  // 1) Applique la vitesse + tente l’autoplay.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.playbackRate = rate;

    // Si autoplay est bloqué, on ne force pas :
    // le timeout de sécurité terminera l’intro.
    void video.play().catch(() => {
      // no-op
    });
  }, [rate]);

  // 2) Fin automatique (ended + timeout).
  useEffect(() => {
    const video = videoRef.current;

    const handleEnded = () => finish();
    if (video) video.addEventListener("ended", handleEnded);

    const timer = window.setTimeout(() => finish(), maxDurationMs);

    return () => {
      window.clearTimeout(timer);
      if (video) video.removeEventListener("ended", handleEnded);
    };
  }, [finish, maxDurationMs]);

  return (
    <div className="fixed inset-0 z-[9999] overflow-hidden bg-background" aria-hidden>
      {/* Vidéo plein écran */}
      <video
        ref={videoRef}
        className="h-full w-full object-cover"
        style={{ objectPosition: view }}
        muted
        playsInline
        autoPlay
        preload="auto"
        onError={() => {
          setVideoError(true);
        }}
      >
        {/*
          IMPORTANT :
          - `.mp4` est la cible (H.264/AAC).
          - `.mov` n'est pas toujours lisible sur Chrome/Firefox/Edge (fallback seulement).
          - `.webm` est optionnel.
          - L'ordre compte : le navigateur prend le premier format qu'il sait lire.
        */}
        {webmSrc ? <source src={webmSrc} type="video/webm" /> : null}
        {mp4Src ? <source src={mp4Src} type="video/mp4" /> : null}
        <source src={src} type="video/quicktime" />
      </video>

      {/* Overlay soft (style studio/VFX) */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background/30 via-background/10 to-background" />

      {/* Fallback si le navigateur ne lit pas le .mov */}
      {videoError && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-6">
          <p className="text-center text-[11px] tracking-[0.18em] text-muted-foreground">
            VIDÉO INDISPONIBLE — LANCEMENT…
          </p>
        </div>
      )}
    </div>
  );
}
