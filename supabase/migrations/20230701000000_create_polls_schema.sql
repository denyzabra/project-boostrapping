-- Create polls table
CREATE TABLE polls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE,
  is_public BOOLEAN DEFAULT TRUE
);

-- Create poll options table
CREATE TABLE poll_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  poll_id UUID NOT NULL REFERENCES polls(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  position INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create votes table
CREATE TABLE votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  poll_id UUID NOT NULL REFERENCES polls(id) ON DELETE CASCADE,
  option_id UUID NOT NULL REFERENCES poll_options(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  ip_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(poll_id, user_id) -- Prevent duplicate votes from the same user
);

-- Create indexes for better query performance
CREATE INDEX idx_polls_created_by ON polls(created_by);
CREATE INDEX idx_poll_options_poll_id ON poll_options(poll_id);
CREATE INDEX idx_votes_poll_id ON votes(poll_id);
CREATE INDEX idx_votes_option_id ON votes(option_id);
CREATE INDEX idx_votes_user_id ON votes(user_id);

-- Create view for poll results
CREATE VIEW poll_results AS
SELECT
  p.id AS poll_id,
  p.title AS poll_title,
  po.id AS option_id,
  po.text AS option_text,
  COUNT(v.id) AS vote_count
FROM
  polls p
JOIN
  poll_options po ON p.id = po.poll_id
LEFT JOIN
  votes v ON po.id = v.option_id
GROUP BY
  p.id, p.title, po.id, po.text
ORDER BY
  p.id, vote_count DESC;

-- Enable Row Level Security
ALTER TABLE polls ENABLE ROW LEVEL SECURITY;
ALTER TABLE poll_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

-- Policies for polls table
CREATE POLICY "Public polls are viewable by everyone" 
  ON polls FOR SELECT 
  USING (is_public = TRUE);

CREATE POLICY "Users can create polls" 
  ON polls FOR INSERT 
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own polls" 
  ON polls FOR UPDATE 
  USING (auth.uid() = created_by);

CREATE POLICY "Users can delete their own polls" 
  ON polls FOR DELETE 
  USING (auth.uid() = created_by);

-- Policies for poll_options table
CREATE POLICY "Poll options are viewable by everyone" 
  ON poll_options FOR SELECT 
  USING (TRUE);

CREATE POLICY "Users can create options for their polls" 
  ON poll_options FOR INSERT 
  WITH CHECK (EXISTS (
    SELECT 1 FROM polls 
    WHERE id = poll_options.poll_id AND created_by = auth.uid()
  ));

CREATE POLICY "Users can update options for their polls" 
  ON poll_options FOR UPDATE 
  USING (EXISTS (
    SELECT 1 FROM polls 
    WHERE id = poll_options.poll_id AND created_by = auth.uid()
  ));

-- Policies for votes table
CREATE POLICY "Votes are viewable by everyone" 
  ON votes FOR SELECT 
  USING (TRUE);

CREATE POLICY "Authenticated users can vote" 
  ON votes FOR INSERT 
  WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = user_id);

-- Create functions for vote counting
CREATE OR REPLACE FUNCTION get_poll_results(poll_uuid UUID)
RETURNS TABLE (
  option_id UUID,
  option_text TEXT,
  vote_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    po.id AS option_id,
    po.text AS option_text,
    COUNT(v.id) AS vote_count
  FROM
    poll_options po
  LEFT JOIN
    votes v ON po.id = v.option_id
  WHERE
    po.poll_id = poll_uuid
  GROUP BY
    po.id, po.text
  ORDER BY
    vote_count DESC;
END;
$$ LANGUAGE plpgsql;