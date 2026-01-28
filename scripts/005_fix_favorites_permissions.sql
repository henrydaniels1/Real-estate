-- Fix favorites table permissions
-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own favorites" ON favorites;
DROP POLICY IF EXISTS "Users can add favorites" ON favorites;
DROP POLICY IF EXISTS "Users can remove their favorites" ON favorites;

-- Recreate favorites policies with proper permissions
CREATE POLICY "Users can view their own favorites" ON favorites 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can add favorites" ON favorites 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their favorites" ON favorites 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can remove their favorites" ON favorites 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Ensure RLS is enabled
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- Grant necessary permissions to authenticated users
GRANT SELECT, INSERT, UPDATE, DELETE ON favorites TO authenticated;