CREATE TABLE episodes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    season_id UUID REFERENCES seasons(id) ON DELETE CASCADE,
    episode_number INTEGER NOT NULL,
    title TEXT NOT NULL,
    plot TEXT,
    duration TEXT,
    air_date DATE,
    player_url TEXT,
    poster_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_episodes_season_id ON episodes(season_id);

ALTER TABLE episodes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public episodes are viewable by everyone." ON episodes FOR SELECT USING (true);
CREATE POLICY "Users can insert their own episodes." ON episodes FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Users can update their own episodes." ON episodes FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "Users can delete their own episodes." ON episodes FOR DELETE USING (auth.uid() IS NOT NULL);
