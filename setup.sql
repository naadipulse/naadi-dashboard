-- Run this in Supabase SQL Editor

-- Overall tally table
CREATE TABLE overall_tally (
  id SERIAL PRIMARY KEY,
  party TEXT NOT NULL UNIQUE,
  won INT DEFAULT 0,
  leading INT DEFAULT 0,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Insert initial data
INSERT INTO overall_tally (party, won, leading) VALUES
('DMK+', 0, 0),
('AIADMK+', 0, 0),
('TVK', 0, 0),
('Others', 0, 0);

-- Constituencies table
CREATE TABLE constituencies (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  name_tamil TEXT NOT NULL,
  dmk_votes INT DEFAULT 0,
  aiadmk_votes INT DEFAULT 0,
  tvk_votes INT DEFAULT 0,
  others_votes INT DEFAULT 0,
  leading_party TEXT DEFAULT 'pending',
  lead_margin INT DEFAULT 0,
  status TEXT DEFAULT 'counting',
  rounds_completed INT DEFAULT 0,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Insert key constituencies
INSERT INTO constituencies (name, name_tamil) VALUES
('Kolathur', 'கொளத்தூர்'),
('Perambur', 'பெரம்பூர்'),
('Chepauk-Thiruvallikeni', 'சேப்பாக்கம்-திருவல்லிக்கேணி'),
('Edappadi', 'எடப்பாடி'),
('Coimbatore South', 'கோவை தெற்கு'),
('Coimbatore North', 'கோவை வடக்கு'),
('Madurai Central', 'மதுரை மத்திய'),
('Trichy East', 'திருச்சி கிழக்கு'),
('Gobichettipalayam', 'கோபிசெட்டிபாளையம்'),
('Mylapore', 'மயிலாப்பூர்');

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE overall_tally;
ALTER PUBLICATION supabase_realtime ADD TABLE constituencies;

-- Allow public read access
CREATE POLICY "Public read" ON overall_tally FOR SELECT USING (true);
CREATE POLICY "Public read" ON constituencies FOR SELECT USING (true);

ALTER TABLE overall_tally ENABLE ROW LEVEL SECURITY;
ALTER TABLE constituencies ENABLE ROW LEVEL SECURITY;
