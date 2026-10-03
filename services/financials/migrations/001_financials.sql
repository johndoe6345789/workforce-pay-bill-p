-- TODO (v2): add startup_id FK once D23 startup entity exists.

-- Burn rate inputs (one row per user, upserted)
CREATE TABLE burn_inputs (
    user_id             UUID PRIMARY KEY
                            REFERENCES users(id)
                            ON DELETE CASCADE,
    monthly_burn_gbp    NUMERIC(12,2) NOT NULL DEFAULT 0,
    cash_in_bank_gbp    NUMERIC(12,2) NOT NULL DEFAULT 0,
    monthly_revenue_gbp NUMERIC(12,2) NOT NULL DEFAULT 0,
    notes               TEXT NOT NULL DEFAULT '',
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Unit economics (one row per user, upserted)
CREATE TABLE unit_econ_inputs (
    user_id    UUID PRIMARY KEY
                   REFERENCES users(id)
                   ON DELETE CASCADE,
    cac_gbp    NUMERIC(10,2) NOT NULL DEFAULT 0,
    arpu_gbp   NUMERIC(10,2) NOT NULL DEFAULT 0,
    churn_pct  NUMERIC(5,2)  NOT NULL DEFAULT 0,
    cogs_pct   NUMERIC(5,2)  NOT NULL DEFAULT 0,
    notes      TEXT NOT NULL DEFAULT '',
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Pricing / revenue model inputs (one row per user, upserted)
CREATE TABLE pricing_inputs (
    user_id             UUID PRIMARY KEY
                            REFERENCES users(id)
                            ON DELETE CASCADE,
    revenue_model       TEXT NOT NULL DEFAULT 'subscription',
    price_gbp           NUMERIC(10,2) NOT NULL DEFAULT 0,
    target_mrr_gbp      NUMERIC(12,2) NOT NULL DEFAULT 0,
    initial_customers   INT NOT NULL DEFAULT 0,
    monthly_growth_pct  NUMERIC(5,2) NOT NULL DEFAULT 0,
    notes               TEXT NOT NULL DEFAULT '',
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Hypothesis tracker (many rows per user)
CREATE TABLE financial_hypotheses (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID NOT NULL
                    REFERENCES users(id)
                    ON DELETE CASCADE,
    assumption  TEXT NOT NULL,
    test_method TEXT NOT NULL DEFAULT '',
    result      TEXT NOT NULL DEFAULT '',
    status      TEXT NOT NULL DEFAULT 'untested'
                    CHECK (status IN (
                        'untested',
                        'validated',
                        'invalidated'
                    )),
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_fin_hyp_user
    ON financial_hypotheses(user_id);

-- Kill criteria config (one row per user, upserted)
CREATE TABLE kill_criteria (
    user_id                 UUID PRIMARY KEY
                                REFERENCES users(id)
                                ON DELETE CASCADE,
    runway_months_min       INT NOT NULL DEFAULT 3,
    cac_ltv_ratio_min       NUMERIC(5,2) NOT NULL
                                DEFAULT 0.33,
    weekly_active_users_min INT NOT NULL DEFAULT 0,
    custom_criteria         JSONB NOT NULL DEFAULT '[]',
    updated_at              TIMESTAMPTZ NOT NULL
                                DEFAULT NOW()
);
