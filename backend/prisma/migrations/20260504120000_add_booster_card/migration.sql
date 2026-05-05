-- CreateTable
CREATE TABLE "booster_card" (
    "booster_id" UUID NOT NULL,
    "card_id" UUID NOT NULL,

    CONSTRAINT "booster_card_pkey" PRIMARY KEY ("booster_id","card_id")
);

-- CreateIndex
CREATE INDEX "idx_booster_card_card_id" ON "booster_card"("card_id");

-- AddForeignKey
ALTER TABLE "booster_card" ADD CONSTRAINT "booster_card_booster_id_fkey"
  FOREIGN KEY ("booster_id") REFERENCES "booster"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booster_card" ADD CONSTRAINT "booster_card_card_id_fkey"
  FOREIGN KEY ("card_id") REFERENCES "card"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
