CREATE TABLE seasons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tvshow_id UUID REFERENCES tvshows(id) ON DELETE CASCADE,
    season_number INTEGER NOT NULL,
    title TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_seasons_tvshow_id ON seasons(tvshow_id);

ALTER TABLE seasons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public seasons are viewable by everyone." ON seasons FOR SELECT USING (true);
CREATE POLICY "Users can insert their own seasons." ON seasons FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Users can update their own seasons." ON seasons FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "Users can delete their own seasons." ON seasons FOR DELETE USING (auth.uid() IS NOT NULL);
