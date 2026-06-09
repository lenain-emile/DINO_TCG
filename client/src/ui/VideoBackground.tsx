type Props = {
  mp4Src: string;
  objectPosition?: string;
};

export default function VideoBackground({ mp4Src, objectPosition = "50% 50%" }: Props) {
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden>
      <video
        className="h-full w-full object-cover"
        muted
        playsInline
        autoPlay
        loop
        preload="auto"
        style={{ objectPosition }}
      >
        <source src={mp4Src} type="video/mp4" />
      </video>

      {/* Voiles pour garder le contraste du panel gauche */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-transparent to-background" />
      <div className="absolute inset-0 bg-[radial-gradient(60%_55%_at_70%_45%,transparent_0%,color-mix(in_oklab,var(--background)_75%,transparent)_100%)]" />
    </div>
  );
}
