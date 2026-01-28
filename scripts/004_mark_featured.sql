-- Add is_featured column to properties table
ALTER TABLE properties ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;

-- Mark first 3 properties as featured
UPDATE properties 
SET is_featured = true 
WHERE id IN (
  SELECT id FROM properties 
  ORDER BY created_at 
  LIMIT 3
);
