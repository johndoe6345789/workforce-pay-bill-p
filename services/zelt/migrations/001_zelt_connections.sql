-- Migration: 001_zelt_connections
-- Domain: zelt
-- Stores per-user Zelt API credentials.

CREATE TABLE IF NOT EXISTS zelt_connections (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID        NOT NULL
                           REFERENCES users(id) ON DELETE CASCADE,
  api_key    TEXT        NOT NULL,
  base_url   TEXT        NOT NULL
                           DEFAULT 'https://api.zelt.app',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id)
);

CREATE INDEX IF NOT EXISTS idx_zelt_connections_user_id
  ON zelt_connections (user_id);
