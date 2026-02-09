-- ============================================
-- MASTER MIGRATION FOR EVERGREEN REAL ESTATE
-- Run this in Supabase SQL Editor
-- ============================================

-- 001: Create base tables
CREATE TABLE IF NOT EXISTS properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(12, 2) NOT NULL,
  property_type TEXT NOT NULL CHECK (property_type IN ('house', 'apartment', 'villa', 'condo', 'townhouse', 'bungalow')),
  status TEXT NOT NULL DEFAULT 'for_sale' CHECK (status IN ('for_sale', 'for_rent', 'sold', 'rented')),
  bedrooms INTEGER NOT NULL DEFAULT 0,
  bathrooms INTEGER NOT NULL DEFAULT 0,
  kitchens INTEGER NOT NULL DEFAULT 1,
  garages INTEGER NOT NULL DEFAULT 0,
  area_sqft DECIMAL(10, 2),
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT,
  country TEXT NOT NULL DEFAULT 'Indonesia',
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  image_url TEXT,
  images TEXT[] DEFAULT '{}',
  amenities TEXT[] DEFAULT '{}',
  rating DECIMAL(2, 1) DEFAULT 0,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  featured BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_properties_city ON properties(city);
CREATE INDEX IF NOT EXISTS idx_properties_property_type ON properties(property_type);
CREATE INDEX IF NOT EXISTS idx_properties_status ON properties(status);
CREATE INDEX IF NOT EXISTS idx_properties_price ON properties(price);
CREATE INDEX IF NOT EXISTS idx_properties_user_id ON properties(user_id);
CREATE INDEX IF NOT EXISTS idx_properties_is_featured ON properties(is_featured);

CREATE TABLE IF NOT EXISTS favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, property_id)
);

CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);

CREATE TABLE IF NOT EXISTS inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_inquiries_property_id ON inquiries(property_id);

CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Properties policies
DROP POLICY IF EXISTS "Properties are viewable by everyone" ON properties;
CREATE POLICY "Properties are viewable by everyone" ON properties FOR SELECT USING (true);
DROP POLICY IF EXISTS "Users can insert their own properties" ON properties;
CREATE POLICY "Users can insert their own properties" ON properties FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can update their own properties" ON properties;
CREATE POLICY "Users can update their own properties" ON properties FOR UPDATE USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can delete their own properties" ON properties;
CREATE POLICY "Users can delete their own properties" ON properties FOR DELETE USING (auth.uid() = user_id);

-- Favorites policies
DROP POLICY IF EXISTS "Users can view their own favorites" ON favorites;
CREATE POLICY "Users can view their own favorites" ON favorites FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can add favorites" ON favorites;
CREATE POLICY "Users can add favorites" ON favorites FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can update their favorites" ON favorites;
CREATE POLICY "Users can update their favorites" ON favorites FOR UPDATE USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can remove their favorites" ON favorites;
CREATE POLICY "Users can remove their favorites" ON favorites FOR DELETE USING (auth.uid() = user_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON favorites TO authenticated;

-- Inquiries policies
DROP POLICY IF EXISTS "Anyone can create inquiries" ON inquiries;
CREATE POLICY "Anyone can create inquiries" ON inquiries FOR INSERT WITH CHECK (true);

-- Profiles policies
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON profiles;
CREATE POLICY "Profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
CREATE POLICY "Users can insert their own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Auto-create profile trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data ->> 'full_name', NULL))
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 003: Blog, Services, FAQs
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT NOT NULL,
  image_url TEXT,
  author_name TEXT NOT NULL DEFAULT 'EverGreen Team',
  author_avatar TEXT,
  category TEXT NOT NULL DEFAULT 'General',
  tags TEXT[] DEFAULT '{}',
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category);

ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Blog posts are viewable by everyone" ON blog_posts;
CREATE POLICY "Blog posts are viewable by everyone" ON blog_posts FOR SELECT USING (published = true);

CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  features TEXT[] DEFAULT '{}',
  price_from DECIMAL(10, 2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE services ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Services are viewable by everyone" ON services;
CREATE POLICY "Services are viewable by everyone" ON services FOR SELECT USING (true);

CREATE TABLE IF NOT EXISTS faqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'General',
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "FAQs are viewable by everyone" ON faqs;
CREATE POLICY "FAQs are viewable by everyone" ON faqs FOR SELECT USING (true);

-- 005: Admin tables
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin', 'editor')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE admin_users DISABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  value JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users(id)
);

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Site settings are viewable by everyone" ON site_settings;
CREATE POLICY "Site settings are viewable by everyone" ON site_settings FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admins can manage site settings" ON site_settings;
CREATE POLICY "Admins can manage site settings" ON site_settings FOR ALL USING (
  EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
);

CREATE TABLE IF NOT EXISTS hero_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  background_image TEXT,
  cta_text TEXT DEFAULT 'Search Properties',
  cta_link TEXT DEFAULT '/properties',
  property_tags TEXT[] DEFAULT ARRAY['House', 'Apartment', 'Residential'],
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE hero_content ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Hero content is viewable by everyone" ON hero_content;
CREATE POLICY "Hero content is viewable by everyone" ON hero_content FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admins can manage hero content" ON hero_content;
CREATE POLICY "Admins can manage hero content" ON hero_content FOR ALL USING (
  EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
);

CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  rating INTEGER NOT NULL DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  avatar_url TEXT,
  initials TEXT,
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Testimonials are viewable by everyone" ON testimonials;
CREATE POLICY "Testimonials are viewable by everyone" ON testimonials FOR SELECT USING (is_active = true);
DROP POLICY IF EXISTS "Admins can manage testimonials" ON testimonials;
CREATE POLICY "Admins can manage testimonials" ON testimonials FOR ALL USING (
  EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
);

CREATE TABLE IF NOT EXISTS media_library (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size INTEGER,
  alt_text TEXT,
  folder TEXT DEFAULT 'general',
  uploaded_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE media_library ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Media is viewable by everyone" ON media_library;
CREATE POLICY "Media is viewable by everyone" ON media_library FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admins can manage media" ON media_library;
CREATE POLICY "Admins can manage media" ON media_library FOR ALL USING (
  EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
);

-- Admin policies for existing tables
DROP POLICY IF EXISTS "Admins can manage blog posts" ON blog_posts;
CREATE POLICY "Admins can manage blog posts" ON blog_posts FOR ALL USING (
  EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
);

DROP POLICY IF EXISTS "Admins can manage services" ON services;
CREATE POLICY "Admins can manage services" ON services FOR ALL USING (
  EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
);

DROP POLICY IF EXISTS "Admins can manage faqs" ON faqs;
CREATE POLICY "Admins can manage faqs" ON faqs FOR ALL USING (
  EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
);

DROP POLICY IF EXISTS "Admins can manage all properties" ON properties;
CREATE POLICY "Admins can manage all properties" ON properties FOR ALL USING (
  EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
);

DROP POLICY IF EXISTS "Property owners can view inquiries" ON inquiries;
CREATE POLICY "Property owners can view inquiries" ON inquiries FOR SELECT USING (
  property_id IS NULL OR 
  EXISTS (SELECT 1 FROM properties WHERE properties.id = inquiries.property_id AND properties.user_id = auth.uid())
);

DROP POLICY IF EXISTS "Admins can view all inquiries" ON inquiries;
CREATE POLICY "Admins can view all inquiries" ON inquiries FOR SELECT USING (
  EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
);

-- 010: General inquiries table
CREATE TABLE IF NOT EXISTS general_inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'resolved', 'closed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE general_inquiries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can create general inquiries" ON general_inquiries;
CREATE POLICY "Anyone can create general inquiries" ON general_inquiries FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Admins can view all general inquiries" ON general_inquiries;
CREATE POLICY "Admins can view all general inquiries" ON general_inquiries FOR SELECT USING (
  EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
);
DROP POLICY IF EXISTS "Admins can manage general inquiries" ON general_inquiries;
CREATE POLICY "Admins can manage general inquiries" ON general_inquiries FOR ALL USING (
  EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
);

CREATE INDEX IF NOT EXISTS idx_general_inquiries_status ON general_inquiries(status);
CREATE INDEX IF NOT EXISTS idx_general_inquiries_created_at ON general_inquiries(created_at);
CREATE INDEX IF NOT EXISTS idx_admin_users_role ON admin_users(role);

-- ============================================
-- SAMPLE DATA
-- ============================================

-- Sample properties
INSERT INTO properties (title, description, price, property_type, status, bedrooms, bathrooms, kitchens, garages, area_sqft, address, city, country, latitude, longitude, image_url, rating, featured, is_featured) VALUES
('Dream House Reality', 'A beautiful modern home with stunning architecture and premium finishes throughout.', 367000, 'house', 'for_sale', 4, 3, 2, 1, 2920, 'Jl. Sudirman No. 14', 'Jakarta', 'Indonesia', -6.2088, 106.8456, 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800', 4.9, true, true),
('Atap Langit Homes', 'Luxurious apartment with panoramic city views and modern amenities.', 278000, 'apartment', 'for_sale', 3, 2, 1, 1, 1850, 'Jl. Gatot Subroto', 'Jakarta', 'Indonesia', -6.2297, 106.8295, 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800', 4.7, false, false),
('Midnight Ridge Villa', 'Experience a peaceful escape at this modern retreat set on a quiet hillside with stunning views.', 452000, 'villa', 'for_sale', 6, 4, 2, 2, 3500, 'Jl. Thamrin', 'Jakarta', 'Indonesia', -6.1944, 106.8229, 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800', 4.8, true, true),
('Modern Studio Apartment', 'Cozy studio apartment perfect for young professionals, fully furnished with modern amenities.', 850, 'apartment', 'for_rent', 1, 1, 1, 0, 450, 'Jl. Senayan', 'Jakarta', 'Indonesia', -6.2146, 106.8069, 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800', 4.5, false, false),
('Spacious Family House', 'Beautiful 4-bedroom house for rent in a quiet neighborhood, perfect for families.', 2500, 'house', 'for_rent', 4, 3, 1, 2, 2200, 'Jl. Menteng', 'Jakarta', 'Indonesia', -6.1944, 106.8456, 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800', 4.8, true, true)
ON CONFLICT DO NOTHING;

-- Sample blog posts
INSERT INTO blog_posts (title, slug, excerpt, content, image_url, author_name, category, tags) VALUES
('10 Tips for First-Time Home Buyers', 'first-time-home-buyer-tips', 'Navigate the home buying process with confidence using these essential tips for first-time buyers.', 'Buying your first home is an exciting milestone, but it can also be overwhelming. Here are 10 essential tips to help you navigate the process successfully...', 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800', 'Sarah Johnson', 'Buying Guide', ARRAY['buying', 'tips', 'first-time']),
('Real Estate Market Trends 2026', 'real-estate-market-trends-2026', 'Discover the latest trends shaping the real estate market in 2026 and what they mean for buyers and sellers.', 'The real estate market continues to evolve with new trends emerging. From sustainable housing to smart home technology, here is what to expect...', 'https://images.unsplash.com/photo-1460472178825-e5240623afd5?w=800', 'Michael Chen', 'Market Insights', ARRAY['trends', 'market', '2026'])
ON CONFLICT DO NOTHING;

-- Sample services
INSERT INTO services (title, slug, description, icon, features, price_from) VALUES
('Property Valuation', 'property-valuation', 'Get an accurate market valuation of your property from our certified appraisers.', 'calculator', ARRAY['Certified appraisers', 'Market analysis', 'Detailed report', 'Online consultation'], 150),
('Legal Assistance', 'legal-assistance', 'Expert legal support for all your real estate transactions and documentation.', 'scale', ARRAY['Contract review', 'Title search', 'Closing assistance', 'Dispute resolution'], 300)
ON CONFLICT DO NOTHING;

-- Sample FAQs
INSERT INTO faqs (question, answer, category, sort_order) VALUES
('How do I start my property search?', 'Simply use our search bar on the homepage or browse our property listings. You can filter by location, price, property type, and more.', 'Getting Started', 1),
('What documents do I need to buy a property?', 'Typically you will need ID documents, proof of income, bank statements, and tax returns. Our agents can guide you through the specific requirements.', 'Buying', 2)
ON CONFLICT DO NOTHING;

-- Default hero content
INSERT INTO hero_content (title, subtitle, description, background_image, property_tags) 
SELECT 'Build Your Future, One Property at a Time.', 'Find Your Dream Home', 'Own Your World. One Property at a Time.', '/images/hero-property.jpg', ARRAY['House', 'Apartment', 'Residential']
WHERE NOT EXISTS (SELECT 1 FROM hero_content);

-- Default testimonials
INSERT INTO testimonials (name, role, content, rating, initials, is_featured, sort_order) 
SELECT * FROM (VALUES
  ('Sarah Chen', 'Home Buyer', 'EverGreen made finding our dream home so easy. The verified listings gave us confidence, and our agent was incredibly helpful throughout the process.', 5, 'SC', true, 1),
  ('Michael Wijaya', 'Property Investor', 'The market insights feature helped me make smart investment decisions. I have purchased three properties through EverGreen and could not be happier.', 5, 'MW', true, 2)
) AS t(name, role, content, rating, initials, is_featured, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM testimonials);

-- Default site settings
INSERT INTO site_settings (key, value) 
SELECT * FROM (VALUES
  ('site_name', '"EverGreen"'::jsonb),
  ('site_tagline', '"Build Your Future, One Property at a Time"'::jsonb),
  ('contact_email', '"hello@evergreen.com"'::jsonb)
) AS s(key, value)
WHERE NOT EXISTS (SELECT 1 FROM site_settings WHERE site_settings.key = s.key);
