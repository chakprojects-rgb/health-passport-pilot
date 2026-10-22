CREATE TABLE IF NOT EXISTS workout_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL,
  activity_type TEXT NOT NULL,
  readiness_score INTEGER CHECK (readiness_score >= 1 AND readiness_score <= 10),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE workout_sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Enable read access for all users" ON workout_sessions;
DROP POLICY IF EXISTS "Enable insert access for authenticated users" ON workout_sessions;
DROP POLICY IF EXISTS "Enable update access for authenticated users" ON workout_sessions;
DROP POLICY IF EXISTS "Enable delete access for authenticated users" ON workout_sessions;

CREATE POLICY "Enable read access for all users" ON workout_sessions FOR SELECT USING (true);
CREATE POLICY "Enable insert access for authenticated users" ON workout_sessions FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update access for authenticated users" ON workout_sessions FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Enable delete access for authenticated users" ON workout_sessions FOR DELETE USING (auth.role() = 'authenticated');

CREATE INDEX IF NOT EXISTS workout_sessions_date_idx ON workout_sessions(date);
CREATE INDEX IF NOT EXISTS workout_sessions_activity_type_idx ON workout_sessions(activity_type);