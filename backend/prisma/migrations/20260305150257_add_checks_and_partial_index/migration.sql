-- =========================================================
-- CHECK constraints (non supportés par Prisma nativement)
-- =========================================================

-- gamer
ALTER TABLE "gamer" ADD CONSTRAINT chk_gamer_level CHECK (level >= 1);
ALTER TABLE "gamer" ADD CONSTRAINT chk_gamer_nb_credit CHECK (nb_credit >= 0);
ALTER TABLE "gamer" ADD CONSTRAINT chk_gamer_xp CHECK (xp >= 0);

-- rarity
ALTER TABLE "rarity" ADD CONSTRAINT chk_rarity_probability CHECK (probability >= 0 AND probability <= 1);

-- card
ALTER TABLE "card" ADD CONSTRAINT chk_card_price_mana CHECK (price_mana >= 0);
ALTER TABLE "card" ADD CONSTRAINT chk_card_atk CHECK (atk >= 0);
ALTER TABLE "card" ADD CONSTRAINT chk_card_def CHECK (def >= 0);
ALTER TABLE "card" ADD CONSTRAINT chk_card_life CHECK (life >= 0);

-- deck_card
ALTER TABLE "deck_card" ADD CONSTRAINT chk_deck_card_quantity CHECK (quantity >= 1 AND quantity <= 4);

-- player_card
ALTER TABLE "player_card" ADD CONSTRAINT chk_player_card_quantity CHECK (quantity >= 0);

-- booster_type
ALTER TABLE "booster_type" ADD CONSTRAINT chk_booster_type_price CHECK (price >= 0);

-- booster
ALTER TABLE "booster" ADD CONSTRAINT chk_booster_price CHECK (price >= 0);

-- booster_detained
ALTER TABLE "booster_detained" ADD CONSTRAINT chk_booster_detained_quantity CHECK (quantity >= 0);

-- =========================================================
-- Index partiel : un seul deck actif par gamer
-- =========================================================
CREATE UNIQUE INDEX uq_one_active_deck_per_gamer
ON "deck" ("gamer_id")
WHERE "is_active" = true;