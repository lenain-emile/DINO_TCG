import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// On valide que la variable d'environnement est bien définie au démarrage
// du serveur, afin d'obtenir une erreur claire plutôt qu'un message cryptique.
const databaseUrl = process.env["DATABASE_URL"];
if (!databaseUrl) {
  throw new Error(
    "La variable d'environnement DATABASE_URL est manquante. Veuillez la définir dans votre fichier .env."
  );
}

// Prisma v7 utilise des Driver Adapters pour se connecter à la base de données.
// On crée l'adaptateur PostgreSQL en lui passant la chaîne de connexion.
const adapter = new PrismaPg({ connectionString: databaseUrl });

// Singleton : on ne crée qu'une seule instance du client Prisma pour toute
// l'application, ce qui évite d'ouvrir trop de connexions vers la base de données.
const prisma = new PrismaClient({ adapter });

export default prisma;
