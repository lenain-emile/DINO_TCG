// Icônes SVG de la navbar (trait fin, cohérentes entre OS — pas d'emoji).
type IconeProps = { className?: string };

export function IconeAccueil({ className }: IconeProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 11l9-8 9 8" />
      <path d="M5 10v10h14V10" />
      <path d="M9 20v-6h6v6" />
    </svg>
  );
}

export function IconeCartes({ className }: IconeProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="11" height="15" rx="2" transform="rotate(-8 8.5 11.5)" />
      <rect x="9" y="5" width="11" height="15" rx="2" transform="rotate(8 14.5 12.5)" />
    </svg>
  );
}

export function IconeDecks({ className }: IconeProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="3" width="16" height="18" rx="2" />
      <path d="M12 8v8M8 12h8" />
    </svg>
  );
}

export function IconeCombat({ className }: IconeProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.5 3.5l6 6-9 9-3 1 1-3 9-9z" />
      <path d="M3 21l4-4" />
      <path d="M9.5 3.5l-6 6 4 4" />
    </svg>
  );
}

export function IconeProfil({ className }: IconeProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4 4-6 8-6s8 2 8 6" />
    </svg>
  );
}

export function IconeDeconnexion({ className }: IconeProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 4h3a1 1 0 011 1v14a1 1 0 01-1 1h-3" />
      <path d="M10 17l-5-5 5-5" />
      <path d="M5 12h11" />
    </svg>
  );
}
