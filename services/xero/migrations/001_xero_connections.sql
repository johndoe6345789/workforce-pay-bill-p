-- Migration: 001_xero_connections
-- Domain: xero
-- Stores per-user Xero OAuth tokens and tenant metadata.

CREATE TABLE IF NOT EXISTS xero_connections (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID        NOT NULL
                              REFERENCES users(id) ON DELETE CASCADE,
  tenant_id     TEXT        NOT NULL,
  tenant_name   TEXT        NOT NULL DEFAULT '',
  access_token  TEXT        NOT NULL,
  refresh_token TEXT        NOT NULL,
  expires_at    TIMESTAMPTZ NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id)
);

CREATE INDEX IF NOT EXISTS idx_xero_connections_user_id
  ON xero_connections (user_id);
