// Appels API liés au compte / profil.
const URL_API = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000/api";

function jeton(): string {
  return localStorage.getItem("accessToken") ?? "";
}

// Inscription d'un nouveau compte.
export async function inscrire(nom: string, email: string, mdp: string) {
  const reponse = await fetch(`${URL_API}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: nom, email, password: mdp }),
  });
  const json = await reponse.json();
  if (!reponse.ok || !json.success) throw new Error(json.message ?? "Inscription impossible.");
}

// Connexion : stocke les jetons et renvoie l'utilisateur.
export async function connecter(email: string, mdp: string) {
  const reponse = await fetch(`${URL_API}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password: mdp }),
  });
  const json = await reponse.json();
  if (!reponse.ok || !json.success || !json.data) {
    throw new Error(json.message ?? "Connexion impossible.");
  }
  localStorage.setItem("accessToken", json.data.accessToken);
  localStorage.setItem("refreshToken", json.data.refreshToken);
  localStorage.setItem("user", JSON.stringify(json.data.user));
  return json.data.user;
}

// Récupère le profil connecté (compte + joueur).
export async function lireProfil() {
  const reponse = await fetch(`${URL_API}/auth/me`, {
    headers: { Authorization: `Bearer ${jeton()}` },
  });
  const json = await reponse.json();
  if (!reponse.ok || !json.success) throw new Error("Profil indisponible.");
  // On traduit la réponse backend (anglais) vers nos noms français.
  return {
    nom: json.data.name,
    email: json.data.email,
    gamers: json.data.gamers,
  };
}

// Récupère les boosters détenus par le joueur connecté.
export async function lireBoosters() {
  const reponse = await fetch(`${URL_API}/boosters/detenus`, {
    headers: { Authorization: `Bearer ${jeton()}` },
  });
  const json = await reponse.json();
  if (!reponse.ok || !json.success) throw new Error("Boosters indisponibles.");
  return json.data as { id: string; name: string; price: number; quantity: number }[];
}

// Met à jour le profil (on n'envoie que les champs fournis).
export async function modifierProfil(champs: Record<string, string>) {
  const reponse = await fetch(`${URL_API}/auth/profile`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jeton()}`,
    },
    body: JSON.stringify(champs),
  });
  const json = await reponse.json();
  if (!reponse.ok || !json.success) throw new Error(json.message ?? "Échec.");
  return json.data;
}
