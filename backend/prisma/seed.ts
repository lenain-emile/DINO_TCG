import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { PrismaClient } from "../src/generated/prisma/client";
import * as dotenv from "dotenv";

dotenv.config();

const pool = new Pool({ connectionString: process.env["DATABASE_URL"] });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const cards = [
  // Théropodes
  { name: "Compsognathus",    type: "Théropodes", atk: 2,  def: 1,  life: 1,  rarity: "Commune"    },
  { name: "Coelophysis",      type: "Théropodes", atk: 2,  def: 1,  life: 2,  rarity: "Commune"    },
  { name: "Herrerasaurus",    type: "Théropodes", atk: 3,  def: 2,  life: 2,  rarity: "Commune"    },
  { name: "Gallimimus",       type: "Théropodes", atk: 2,  def: 1,  life: 3,  rarity: "Commune"    },
  { name: "Ornithomimus",     type: "Théropodes", atk: 3,  def: 1,  life: 1,  rarity: "Commune"    },
  { name: "Oviraptor",        type: "Théropodes", atk: 3,  def: 2,  life: 2,  rarity: "Commune"    },
  { name: "Troodon",          type: "Théropodes", atk: 4,  def: 2,  life: 2,  rarity: "Commune"    },
  { name: "Monolophosaurus",  type: "Théropodes", atk: 4,  def: 2,  life: 3,  rarity: "Commune"    },
  { name: "Majungasaurus",    type: "Théropodes", atk: 5,  def: 3,  life: 2,  rarity: "Commune"    },
  { name: "Cryolophosaurus",  type: "Théropodes", atk: 4,  def: 3,  life: 4,  rarity: "Commune"    },
  { name: "Neovenator",       type: "Théropodes", atk: 5,  def: 3,  life: 3,  rarity: "Commune"    },
  { name: "Ceratosaurus",     type: "Théropodes", atk: 6,  def: 4,  life: 3,  rarity: "Commune"    },
  { name: "Dilophosaurus",    type: "Théropodes", atk: 7,  def: 3,  life: 4,  rarity: "Rare"       },
  { name: "Deinonychus",      type: "Théropodes", atk: 6,  def: 2,  life: 5,  rarity: "Rare"       },
  { name: "Baryonyx",         type: "Théropodes", atk: 8,  def: 4,  life: 5,  rarity: "Rare"       },
  { name: "Carnotaurus",      type: "Théropodes", atk: 9,  def: 4,  life: 4,  rarity: "Rare"       },
  { name: "Allosaurus",       type: "Théropodes", atk: 10, def: 5,  life: 6,  rarity: "Rare"       },
  { name: "Spinosaurus",      type: "Théropodes", atk: 12, def: 5,  life: 8,  rarity: "Epique"     },
  { name: "Velociraptor",     type: "Théropodes", atk: 14, def: 3,  life: 6,  rarity: "Epique"     },
  { name: "Tyrannosaurus Rex",type: "Théropodes", atk: 18, def: 6,  life: 12, rarity: "Légendaire" },

  // Sauropodes
  { name: "Vulcanodon",       type: "Sauropodes", atk: 1,  def: 2,  life: 3,  rarity: "Commune"    },
  { name: "Shunosaurus",      type: "Sauropodes", atk: 2,  def: 3,  life: 4,  rarity: "Commune"    },
  { name: "Dicraeosaurus",    type: "Sauropodes", atk: 1,  def: 2,  life: 5,  rarity: "Commune"    },
  { name: "Saltasaurus",      type: "Sauropodes", atk: 2,  def: 4,  life: 6,  rarity: "Commune"    },
  { name: "Nigersaurus",      type: "Sauropodes", atk: 2,  def: 3,  life: 7,  rarity: "Commune"    },
  { name: "Amargasaurus",     type: "Sauropodes", atk: 3,  def: 3,  life: 6,  rarity: "Commune"    },
  { name: "Camarasaurus",     type: "Sauropodes", atk: 3,  def: 4,  life: 8,  rarity: "Commune"    },
  { name: "Mamenchisaurus",   type: "Sauropodes", atk: 2,  def: 3,  life: 9,  rarity: "Commune"    },
  { name: "Alamosaurus",      type: "Sauropodes", atk: 4,  def: 5,  life: 8,  rarity: "Commune"    },
  { name: "Titanosaurus",     type: "Sauropodes", atk: 4,  def: 5,  life: 10, rarity: "Commune"    },
  { name: "Supersaurus",      type: "Sauropodes", atk: 5,  def: 4,  life: 11, rarity: "Commune"    },
  { name: "Seismosaurus",     type: "Sauropodes", atk: 4,  def: 4,  life: 12, rarity: "Commune"    },
  { name: "Dreadnoughtus",    type: "Sauropodes", atk: 5,  def: 6,  life: 14, rarity: "Rare"       },
  { name: "Patagotitan",      type: "Sauropodes", atk: 6,  def: 6,  life: 15, rarity: "Rare"       },
  { name: "Giraffatitan",     type: "Sauropodes", atk: 7,  def: 5,  life: 14, rarity: "Rare"       },
  { name: "Argentinosaurus",  type: "Sauropodes", atk: 8,  def: 6,  life: 16, rarity: "Rare"       },
  { name: "Apatosaurus",      type: "Sauropodes", atk: 7,  def: 5,  life: 18, rarity: "Rare"       },
  { name: "Brontosaurus",     type: "Sauropodes", atk: 9,  def: 6,  life: 22, rarity: "Epique"     },
  { name: "Diplodocus",       type: "Sauropodes", atk: 8,  def: 4,  life: 24, rarity: "Epique"     },
  { name: "Brachiosaurus",    type: "Sauropodes", atk: 10, def: 7,  life: 30, rarity: "Légendaire" },

  // Cératopsiens
  { name: "Microceratus",       type: "Cératopsiens", atk: 1,  def: 2,  life: 2,  rarity: "Commune"    },
  { name: "Leptoceratops",      type: "Cératopsiens", atk: 2,  def: 2,  life: 2,  rarity: "Commune"    },
  { name: "Psittacosaurus",     type: "Cératopsiens", atk: 2,  def: 2,  life: 3,  rarity: "Commune"    },
  { name: "Homalocephale",      type: "Cératopsiens", atk: 3,  def: 3,  life: 2,  rarity: "Commune"    },
  { name: "Stegoceras",         type: "Cératopsiens", atk: 3,  def: 3,  life: 3,  rarity: "Commune"    },
  { name: "Zuniceratops",       type: "Cératopsiens", atk: 3,  def: 4,  life: 4,  rarity: "Commune"    },
  { name: "Einiosaurus",        type: "Cératopsiens", atk: 4,  def: 4,  life: 4,  rarity: "Commune"    },
  { name: "Kosmoceratops",      type: "Cératopsiens", atk: 3,  def: 5,  life: 5,  rarity: "Commune"    },
  { name: "Diabloceratops",     type: "Cératopsiens", atk: 5,  def: 5,  life: 4,  rarity: "Commune"    },
  { name: "Nasutoceratops",     type: "Cératopsiens", atk: 4,  def: 6,  life: 6,  rarity: "Commune"    },
  { name: "Centrosaurus",       type: "Cératopsiens", atk: 5,  def: 5,  life: 5,  rarity: "Commune"    },
  { name: "Chasmosaurus",       type: "Cératopsiens", atk: 4,  def: 6,  life: 7,  rarity: "Commune"    },
  { name: "Dracorex",           type: "Cératopsiens", atk: 7,  def: 4,  life: 5,  rarity: "Rare"       },
  { name: "Stygimoloch",        type: "Cératopsiens", atk: 8,  def: 4,  life: 4,  rarity: "Rare"       },
  { name: "Protoceratops",      type: "Cératopsiens", atk: 6,  def: 5,  life: 8,  rarity: "Rare"       },
  { name: "Pachyrhinosaurus",   type: "Cératopsiens", atk: 7,  def: 7,  life: 9,  rarity: "Rare"       },
  { name: "Torosaurus",         type: "Cératopsiens", atk: 8,  def: 8,  life: 10, rarity: "Rare"       },
  { name: "Pachycephalosaurus", type: "Cératopsiens", atk: 12, def: 6,  life: 8,  rarity: "Epique"     },
  { name: "Styracosaurus",      type: "Cératopsiens", atk: 10, def: 7,  life: 12, rarity: "Epique"     },
  { name: "Triceratops",        type: "Cératopsiens", atk: 14, def: 9,  life: 16, rarity: "Légendaire" },

  // Thyréophores
  { name: "Minmi",           type: "Thyréophores", atk: 1,  def: 4,  life: 4,  rarity: "Commune"    },
  { name: "Scelidosaurus",   type: "Thyréophores", atk: 2,  def: 4,  life: 4,  rarity: "Commune"    },
  { name: "Gargoyleosaurus", type: "Thyréophores", atk: 1,  def: 5,  life: 6,  rarity: "Commune"    },
  { name: "Wuerhosaurus",    type: "Thyréophores", atk: 3,  def: 5,  life: 5,  rarity: "Commune"    },
  { name: "Huayangosaurus",  type: "Thyréophores", atk: 2,  def: 6,  life: 7,  rarity: "Commune"    },
  { name: "Tuojiangosaurus", type: "Thyréophores", atk: 3,  def: 5,  life: 6,  rarity: "Commune"    },
  { name: "Gastonia",        type: "Thyréophores", atk: 3,  def: 7,  life: 8,  rarity: "Commune"    },
  { name: "Polacanthus",     type: "Thyréophores", atk: 4,  def: 6,  life: 7,  rarity: "Commune"    },
  { name: "Sauropelta",      type: "Thyréophores", atk: 2,  def: 8,  life: 10, rarity: "Commune"    },
  { name: "Edmontonia",      type: "Thyréophores", atk: 4,  def: 8,  life: 9,  rarity: "Commune"    },
  { name: "Nodosaurus",      type: "Thyréophores", atk: 3,  def: 7,  life: 11, rarity: "Commune"    },
  { name: "Panoplosaurus",   type: "Thyréophores", atk: 5,  def: 8,  life: 8,  rarity: "Commune"    },
  { name: "Lexovisaurus",    type: "Thyréophores", atk: 5,  def: 7,  life: 12, rarity: "Rare"       },
  { name: "Dacentrurus",     type: "Thyréophores", atk: 6,  def: 8,  life: 11, rarity: "Rare"       },
  { name: "Miragaia",        type: "Thyréophores", atk: 4,  def: 7,  life: 14, rarity: "Rare"       },
  { name: "Euoplocephalus",  type: "Thyréophores", atk: 6,  def: 9,  life: 15, rarity: "Rare"       },
  { name: "Pinacosaurus",    type: "Thyréophores", atk: 7,  def: 9,  life: 14, rarity: "Rare"       },
  { name: "Kentrosaurus",    type: "Thyréophores", atk: 8,  def: 8,  life: 18, rarity: "Epique"     },
  { name: "Ankylosaurus",    type: "Thyréophores", atk: 10, def: 10, life: 16, rarity: "Epique"     },
  { name: "Stegosaurus",     type: "Thyréophores", atk: 12, def: 9,  life: 22, rarity: "Légendaire" },
];

async function main() {
  console.log("Seeding cards...");

  const rarities = await prisma.rarity.findMany();
  const normalizeKey = (s: string) => s
    .replace(/\u201a/g, "e")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

  const rarityMap = new Map(rarities.map((r: { name: string; id: string }) => [normalizeKey(r.name), r.id]));

  for (const card of cards) {
    const rarityId = rarityMap.get(normalizeKey(card.rarity));
    if (!rarityId) {
      console.warn(`Rarity not found: ${card.rarity} — skipping ${card.name}`);
      continue;
    }

    await prisma.card.upsert({
      where: { name_type: { name: card.name, type: card.type } },
      create: { name: card.name, type: card.type, atk: card.atk, def: card.def, life: card.life, rarityId },
      update: { atk: card.atk, def: card.def, life: card.life, rarityId },
    });
  }

  console.log(`${cards.length} cards seeded.`);

  // ------------------------------------------------------------------
  // Booster Standard — contient toutes les cartes
  // ------------------------------------------------------------------
  const booster = await prisma.booster.upsert({
    where: { name: "Booster Standard" },
    create: { name: "Booster Standard", price: 100 },
    update: {},
  });

  const allCards = await prisma.card.findMany({ select: { id: true } });

  for (const card of allCards) {
    await prisma.boosterCard.upsert({
      where: { boosterId_cardId: { boosterId: booster.id, cardId: card.id } },
      create: { boosterId: booster.id, cardId: card.id },
      update: {},
    });
  }

  console.log(`Booster "${booster.name}" seeded with ${allCards.length} cards in pool.`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
