ALTER TABLE leads ADD COLUMN city TEXT;

CREATE INDEX IF NOT EXISTS idx_leads_city_submitted_at ON leads(city, submitted_at DESC);
