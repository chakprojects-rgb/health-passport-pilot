-- Create exercises table for wger exercise database
CREATE TABLE IF NOT EXISTS exercises (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  muscle_groups TEXT[],
  equipment TEXT[],
  difficulty TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS (Row Level Security)
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Enable read access for all users" ON exercises;
DROP POLICY IF EXISTS "Enable insert access for seeding" ON exercises;
DROP POLICY IF EXISTS "Enable update access for all users" ON exercises;
DROP POLICY IF EXISTS "Enable delete access for all users" ON exercises;

-- Create policy to allow read access to all users (including unauthenticated)
CREATE POLICY "Enable read access for all users" ON exercises FOR SELECT USING (true);

-- Create policy to allow insert access for all authenticated users
CREATE POLICY "Enable insert access for authenticated users" ON exercises FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Create policy to allow update access for all authenticated users
CREATE POLICY "Enable update access for authenticated users" ON exercises FOR UPDATE USING (auth.role() = 'authenticated');

-- Create policy to allow delete access for all authenticated users
CREATE POLICY "Enable delete access for authenticated users" ON exercises FOR DELETE USING (auth.role() = 'authenticated');

-- Create index for faster searches
CREATE INDEX IF NOT EXISTS exercises_name_idx ON exercises(name);
CREATE INDEX IF NOT EXISTS exercises_category_idx ON exercises(category);
CREATE INDEX IF NOT EXISTS exercises_muscle_groups_idx ON exercises USING GIN(muscle_groups);