-- Sample data for testing the polls database schema

-- Insert sample polls
INSERT INTO polls (title, description, created_by)
VALUES 
  ('Favorite Programming Language', 'What programming language do you prefer to use?', 'system'),
  ('Best Frontend Framework', 'Which frontend framework do you think is the best?', 'system'),
  ('Database Preference', 'Which database system do you prefer to work with?', 'system');

-- Get the poll IDs
DO $$
DECLARE
  poll1_id UUID;
  poll2_id UUID;
  poll3_id UUID;
  option_id UUID;
BEGIN
  -- Get poll IDs
  SELECT id INTO poll1_id FROM polls WHERE title = 'Favorite Programming Language' LIMIT 1;
  SELECT id INTO poll2_id FROM polls WHERE title = 'Best Frontend Framework' LIMIT 1;
  SELECT id INTO poll3_id FROM polls WHERE title = 'Database Preference' LIMIT 1;
  
  -- Insert options for poll 1
  INSERT INTO poll_options (poll_id, text)
  VALUES 
    (poll1_id, 'JavaScript'),
    (poll1_id, 'Python'),
    (poll1_id, 'Java'),
    (poll1_id, 'C#'),
    (poll1_id, 'TypeScript'),
    (poll1_id, 'Go');
  
  -- Insert options for poll 2
  INSERT INTO poll_options (poll_id, text)
  VALUES 
    (poll2_id, 'React'),
    (poll2_id, 'Vue'),
    (poll2_id, 'Angular'),
    (poll2_id, 'Svelte'),
    (poll2_id, 'Next.js');
  
  -- Insert options for poll 3
  INSERT INTO poll_options (poll_id, text)
  VALUES 
    (poll3_id, 'PostgreSQL'),
    (poll3_id, 'MySQL'),
    (poll3_id, 'MongoDB'),
    (poll3_id, 'SQLite'),
    (poll3_id, 'Supabase');
  
  -- Insert some sample votes
  -- For poll 1
  SELECT id INTO option_id FROM poll_options WHERE poll_id = poll1_id AND text = 'JavaScript' LIMIT 1;
  INSERT INTO votes (poll_id, option_id, voter_id) VALUES (poll1_id, option_id, 'user1');
  
  SELECT id INTO option_id FROM poll_options WHERE poll_id = poll1_id AND text = 'Python' LIMIT 1;
  INSERT INTO votes (poll_id, option_id, voter_id) VALUES (poll1_id, option_id, 'user2');
  INSERT INTO votes (poll_id, option_id, voter_id) VALUES (poll1_id, option_id, 'user3');
  
  SELECT id INTO option_id FROM poll_options WHERE poll_id = poll1_id AND text = 'TypeScript' LIMIT 1;
  INSERT INTO votes (poll_id, option_id, voter_id) VALUES (poll1_id, option_id, 'user4');
  INSERT INTO votes (poll_id, option_id, voter_id) VALUES (poll1_id, option_id, 'user5');
  INSERT INTO votes (poll_id, option_id, voter_id) VALUES (poll1_id, option_id, 'user6');
  
  -- For poll 2
  SELECT id INTO option_id FROM poll_options WHERE poll_id = poll2_id AND text = 'React' LIMIT 1;
  INSERT INTO votes (poll_id, option_id, voter_id) VALUES (poll2_id, option_id, 'user1');
  INSERT INTO votes (poll_id, option_id, voter_id) VALUES (poll2_id, option_id, 'user2');
  
  SELECT id INTO option_id FROM poll_options WHERE poll_id = poll2_id AND text = 'Vue' LIMIT 1;
  INSERT INTO votes (poll_id, option_id, voter_id) VALUES (poll2_id, option_id, 'user3');
  
  SELECT id INTO option_id FROM poll_options WHERE poll_id = poll2_id AND text = 'Next.js' LIMIT 1;
  INSERT INTO votes (poll_id, option_id, voter_id) VALUES (poll2_id, option_id, 'user4');
  INSERT INTO votes (poll_id, option_id, voter_id) VALUES (poll2_id, option_id, 'user5');
  
  -- For poll 3
  SELECT id INTO option_id FROM poll_options WHERE poll_id = poll3_id AND text = 'PostgreSQL' LIMIT 1;
  INSERT INTO votes (poll_id, option_id, voter_id) VALUES (poll3_id, option_id, 'user1');
  INSERT INTO votes (poll_id, option_id, voter_id) VALUES (poll3_id, option_id, 'user2');
  
  SELECT id INTO option_id FROM poll_options WHERE poll_id = poll3_id AND text = 'Supabase' LIMIT 1;
  INSERT INTO votes (poll_id, option_id, voter_id) VALUES (poll3_id, option_id, 'user3');
  INSERT INTO votes (poll_id, option_id, voter_id) VALUES (poll3_id, option_id, 'user4');
  INSERT INTO votes (poll_id, option_id, voter_id) VALUES (poll3_id, option_id, 'user5');
  INSERT INTO votes (poll_id, option_id, voter_id) VALUES (poll3_id, option_id, 'user6');
  
END $$;

-- Test query to verify data
SELECT * FROM poll_results ORDER BY poll_id, vote_count DESC;