-- Profile identity ledger: canonical hashes + signatures
CREATE TABLE IF NOT EXISTS profile_ledger (
    id UUID PRIMARY KEY,
    athlete_id TEXT NOT NULL,
    identity_hash TEXT NOT NULL,
    signature TEXT NOT NULL,
    public_key TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_profile_ledger_athlete ON profile_ledger(athlete_id);
CREATE INDEX idx_profile_ledger_hash ON profile_ledger(identity_hash);

-- NIL deal receipts with compliance status
CREATE TABLE IF NOT EXISTS nil_receipts (
    id UUID PRIMARY KEY,
    athlete_id TEXT NOT NULL,
    brand TEXT NOT NULL,
    amount_cents BIGINT NOT NULL,
    deal_type TEXT NOT NULL,
    state TEXT NOT NULL,
    deal_hash TEXT NOT NULL,
    signature TEXT NOT NULL,
    compliance_status TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_nil_receipts_athlete ON nil_receipts(athlete_id);
CREATE INDEX idx_nil_receipts_state ON nil_receipts(state);

-- Compliance audit log
CREATE TABLE IF NOT EXISTS compliance_checks (
    id UUID PRIMARY KEY,
    receipt_id UUID REFERENCES nil_receipts(id),
    state TEXT NOT NULL,
    status TEXT NOT NULL,
    warnings TEXT[] NOT NULL DEFAULT '{}',
    blocked_reason TEXT,
    checked_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Scraped events from recruiting sites
CREATE TABLE IF NOT EXISTS scraped_events (
    id UUID PRIMARY KEY,
    source TEXT NOT NULL,
    title TEXT NOT NULL,
    url TEXT NOT NULL UNIQUE,
    summary TEXT,
    scraped_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_scraped_events_source ON scraped_events(source);

-- Ranking snapshots for percentile computation
CREATE TABLE IF NOT EXISTS ranking_snapshots (
    id UUID PRIMARY KEY,
    metric TEXT NOT NULL,
    athlete_id TEXT NOT NULL,
    value DOUBLE PRECISION NOT NULL,
    percentile DOUBLE PRECISION NOT NULL DEFAULT 0,
    rank BIGINT NOT NULL DEFAULT 0,
    computed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_ranking_metric_athlete ON ranking_snapshots(metric, athlete_id);
CREATE INDEX idx_ranking_computed ON ranking_snapshots(computed_at DESC);
