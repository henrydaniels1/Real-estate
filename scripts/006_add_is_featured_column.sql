-- Add missing is_featured column to properties table if it doesn't exist
ALTER TABLE properties ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;

-- Update existing featured column to is_featured if needed
UPDATE properties SET is_featured = featured WHERE is_featured IS NULL;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_properties_is_featured ON properties(is_featured);