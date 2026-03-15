CREATE TABLE "refresh_token" (
  "id" UUID NOT NULL,
  "account_id" UUID NOT NULL,
  "token_hash" TEXT NOT NULL,
  "expires_at" TIMESTAMPTZ NOT NULL,
  "revoked_at" TIMESTAMPTZ,
  "replaced_by_id" UUID,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT "refresh_token_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "refresh_token_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "account" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "idx_refresh_token_account_id" ON "refresh_token" ("account_id");
CREATE INDEX "idx_refresh_token_expires_at" ON "refresh_token" ("expires_at");
CREATE INDEX "idx_refresh_token_revoked_at" ON "refresh_token" ("revoked_at");
