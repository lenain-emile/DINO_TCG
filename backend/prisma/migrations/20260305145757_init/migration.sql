-- CreateTable
CREATE TABLE "account" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'user',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gamer" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "account_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "level" INTEGER NOT NULL DEFAULT 1,
    "nb_credit" INTEGER NOT NULL DEFAULT 0,
    "xp" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "gamer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rarity" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "probability" DECIMAL(6,5) NOT NULL,

    CONSTRAINT "rarity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "special_effect" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "description" TEXT,
    "damage" INTEGER NOT NULL DEFAULT 0,
    "boost_life" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "special_effect_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "card" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "price_mana" INTEGER NOT NULL DEFAULT 0,
    "atk" INTEGER NOT NULL DEFAULT 0,
    "def" INTEGER NOT NULL DEFAULT 0,
    "life" INTEGER NOT NULL DEFAULT 0,
    "image" TEXT,
    "rarity_id" UUID NOT NULL,
    "special_effect_id" UUID,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "card_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "deck" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "gamer_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "deck_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "deck_card" (
    "deck_id" UUID NOT NULL,
    "card_id" UUID NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "deck_card_pkey" PRIMARY KEY ("deck_id","card_id")
);

-- CreateTable
CREATE TABLE "player_card" (
    "gamer_id" UUID NOT NULL,
    "card_id" UUID NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "acquired_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "player_card_pkey" PRIMARY KEY ("gamer_id","card_id")
);

-- CreateTable
CREATE TABLE "booster_type" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "price" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "booster_type_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "booster" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "booster_type_id" UUID,
    "name" TEXT NOT NULL,
    "price" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "booster_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "booster_detained" (
    "gamer_id" UUID NOT NULL,
    "booster_id" UUID NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "booster_detained_pkey" PRIMARY KEY ("gamer_id","booster_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "account_email_key" ON "account"("email");

-- CreateIndex
CREATE INDEX "idx_account_email" ON "account"("email");

-- CreateIndex
CREATE INDEX "idx_gamer_account_id" ON "gamer"("account_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_gamer_account_name" ON "gamer"("account_id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "rarity_name_key" ON "rarity"("name");

-- CreateIndex
CREATE UNIQUE INDEX "special_effect_name_key" ON "special_effect"("name");

-- CreateIndex
CREATE INDEX "idx_card_rarity_id" ON "card"("rarity_id");

-- CreateIndex
CREATE INDEX "idx_card_special_effect_id" ON "card"("special_effect_id");

-- CreateIndex
CREATE INDEX "idx_card_type" ON "card"("type");

-- CreateIndex
CREATE UNIQUE INDEX "uq_card_name_type" ON "card"("name", "type");

-- CreateIndex
CREATE INDEX "idx_deck_gamer_id" ON "deck"("gamer_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_deck_gamer_name" ON "deck"("gamer_id", "name");

-- CreateIndex
CREATE INDEX "idx_deck_card_card_id" ON "deck_card"("card_id");

-- CreateIndex
CREATE INDEX "idx_player_card_card_id" ON "player_card"("card_id");

-- CreateIndex
CREATE UNIQUE INDEX "booster_type_name_key" ON "booster_type"("name");

-- CreateIndex
CREATE UNIQUE INDEX "booster_name_key" ON "booster"("name");

-- CreateIndex
CREATE INDEX "idx_booster_type_id" ON "booster"("booster_type_id");

-- CreateIndex
CREATE INDEX "idx_booster_detained_booster_id" ON "booster_detained"("booster_id");

-- AddForeignKey
ALTER TABLE "gamer" ADD CONSTRAINT "gamer_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "card" ADD CONSTRAINT "card_rarity_id_fkey" FOREIGN KEY ("rarity_id") REFERENCES "rarity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "card" ADD CONSTRAINT "card_special_effect_id_fkey" FOREIGN KEY ("special_effect_id") REFERENCES "special_effect"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deck" ADD CONSTRAINT "deck_gamer_id_fkey" FOREIGN KEY ("gamer_id") REFERENCES "gamer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deck_card" ADD CONSTRAINT "deck_card_deck_id_fkey" FOREIGN KEY ("deck_id") REFERENCES "deck"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deck_card" ADD CONSTRAINT "deck_card_card_id_fkey" FOREIGN KEY ("card_id") REFERENCES "card"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "player_card" ADD CONSTRAINT "player_card_gamer_id_fkey" FOREIGN KEY ("gamer_id") REFERENCES "gamer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "player_card" ADD CONSTRAINT "player_card_card_id_fkey" FOREIGN KEY ("card_id") REFERENCES "card"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booster" ADD CONSTRAINT "booster_booster_type_id_fkey" FOREIGN KEY ("booster_type_id") REFERENCES "booster_type"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booster_detained" ADD CONSTRAINT "booster_detained_gamer_id_fkey" FOREIGN KEY ("gamer_id") REFERENCES "gamer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booster_detained" ADD CONSTRAINT "booster_detained_booster_id_fkey" FOREIGN KEY ("booster_id") REFERENCES "booster"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
