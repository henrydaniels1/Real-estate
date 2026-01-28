-- Add rental properties
INSERT INTO properties (title, description, price, property_type, status, bedrooms, bathrooms, kitchens, garages, area_sqft, address, city, country, image_url, rating, featured) VALUES
('Modern Studio Apartment', 'Cozy studio apartment perfect for young professionals, fully furnished with modern amenities.', 850, 'apartment', 'for_rent', 1, 1, 1, 0, 450, 'Jl. Senayan', 'Jakarta', 'Indonesia', 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800', 4.5, false),
('Spacious Family House', 'Beautiful 4-bedroom house for rent in a quiet neighborhood, perfect for families.', 2500, 'house', 'for_rent', 4, 3, 1, 2, 2200, 'Jl. Menteng', 'Jakarta', 'Indonesia', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800', 4.8, true),
('Luxury Penthouse Suite', 'Executive penthouse with stunning city views, private elevator access, and rooftop garden.', 5500, 'apartment', 'for_rent', 3, 2, 1, 1, 1800, 'Jl. SCBD', 'Jakarta', 'Indonesia', 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800', 4.9, true),
('Cozy Townhouse', 'Charming townhouse with garden, ideal for small families seeking suburban comfort.', 1800, 'townhouse', 'for_rent', 3, 2, 1, 1, 1400, 'Jl. Kemang', 'Jakarta', 'Indonesia', 'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=800', 4.6, false),
('Beach Villa Retreat', 'Stunning beachfront villa available for long-term rent, includes private pool and beach access.', 4200, 'villa', 'for_rent', 5, 4, 2, 2, 3500, 'Jl. Pantai Indah', 'Bali', 'Indonesia', 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800', 5.0, true),
('Downtown Condo', 'Modern condo in the heart of downtown, walking distance to shopping and dining.', 1200, 'condo', 'for_rent', 2, 1, 1, 1, 850, 'Jl. Sudirman', 'Jakarta', 'Indonesia', 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800', 4.4, false);

-- Create blog posts table
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

-- Blog posts RLS
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Blog posts are viewable by everyone" ON blog_posts FOR SELECT USING (published = true);

-- Insert sample blog posts
INSERT INTO blog_posts (title, slug, excerpt, content, image_url, author_name, category, tags) VALUES
('10 Tips for First-Time Home Buyers', 'first-time-home-buyer-tips', 'Navigate the home buying process with confidence using these essential tips for first-time buyers.', 'Buying your first home is an exciting milestone, but it can also be overwhelming. Here are 10 essential tips to help you navigate the process successfully...', 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800', 'Sarah Johnson', 'Buying Guide', ARRAY['buying', 'tips', 'first-time']),
('Real Estate Market Trends 2026', 'real-estate-market-trends-2026', 'Discover the latest trends shaping the real estate market in 2026 and what they mean for buyers and sellers.', 'The real estate market continues to evolve with new trends emerging. From sustainable housing to smart home technology, here is what to expect...', 'https://images.unsplash.com/photo-1460472178825-e5240623afd5?w=800', 'Michael Chen', 'Market Insights', ARRAY['trends', 'market', '2026']),
('How to Stage Your Home for a Quick Sale', 'home-staging-tips', 'Learn professional staging techniques that can help sell your home faster and for a better price.', 'First impressions matter when selling your home. Professional staging can make a significant difference in how quickly your property sells...', 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800', 'Emma Williams', 'Selling Guide', ARRAY['staging', 'selling', 'tips']),
('Understanding Mortgage Options', 'understanding-mortgage-options', 'A comprehensive guide to different mortgage types and how to choose the right one for your situation.', 'Choosing the right mortgage is crucial for your financial health. This guide breaks down the different types of mortgages available...', 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800', 'David Park', 'Finance', ARRAY['mortgage', 'finance', 'loans']),
('Best Neighborhoods in Jakarta for Families', 'best-jakarta-neighborhoods-families', 'Explore the top family-friendly neighborhoods in Jakarta with great schools and amenities.', 'Jakarta offers many wonderful neighborhoods for families. From Menteng to Kemang, discover which areas provide the best quality of life...', 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800', 'Lisa Tan', 'Location Guide', ARRAY['jakarta', 'families', 'neighborhoods']),
('Investment Properties: A Beginner Guide', 'investment-properties-guide', 'Learn the basics of real estate investment and how to build wealth through property.', 'Real estate investment can be a powerful wealth-building tool. This guide covers everything beginners need to know...', 'https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800', 'Robert Kim', 'Investment', ARRAY['investment', 'guide', 'wealth']);

-- Create services table
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
CREATE POLICY "Services are viewable by everyone" ON services FOR SELECT USING (true);

-- Insert sample services
INSERT INTO services (title, slug, description, icon, features, price_from) VALUES
('Property Valuation', 'property-valuation', 'Get an accurate market valuation of your property from our certified appraisers.', 'calculator', ARRAY['Certified appraisers', 'Market analysis', 'Detailed report', 'Online consultation'], 150),
('Legal Assistance', 'legal-assistance', 'Expert legal support for all your real estate transactions and documentation.', 'scale', ARRAY['Contract review', 'Title search', 'Closing assistance', 'Dispute resolution'], 300),
('Home Inspection', 'home-inspection', 'Comprehensive property inspection to identify potential issues before you buy.', 'search', ARRAY['Structural inspection', 'Electrical systems', 'Plumbing check', 'Pest inspection'], 250),
('Mortgage Consultation', 'mortgage-consultation', 'Get personalized mortgage advice and find the best rates for your situation.', 'building', ARRAY['Rate comparison', 'Pre-approval assistance', 'Refinancing options', 'First-time buyer programs'], 0),
('Property Management', 'property-management', 'Full-service property management for landlords and investors.', 'home', ARRAY['Tenant screening', 'Rent collection', 'Maintenance coordination', 'Financial reporting'], 200),
('Interior Design', 'interior-design', 'Transform your space with our professional interior design services.', 'paintbrush', ARRAY['Consultation', 'Space planning', '3D visualization', 'Furniture sourcing'], 500);

-- Create FAQ table
CREATE TABLE IF NOT EXISTS faqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'General',
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "FAQs are viewable by everyone" ON faqs FOR SELECT USING (true);

-- Insert sample FAQs
INSERT INTO faqs (question, answer, category, sort_order) VALUES
('How do I start my property search?', 'Simply use our search bar on the homepage or browse our property listings. You can filter by location, price, property type, and more.', 'Getting Started', 1),
('What documents do I need to buy a property?', 'Typically you will need ID documents, proof of income, bank statements, and tax returns. Our agents can guide you through the specific requirements.', 'Buying', 2),
('How long does the buying process take?', 'The average home purchase takes 30-45 days from offer acceptance to closing, depending on financing and inspection requirements.', 'Buying', 3),
('Can I schedule a property viewing?', 'Yes! Click the "Contact Agent" button on any property listing to schedule a viewing at your convenience.', 'Viewing', 4),
('What are the fees involved in buying?', 'Buyer fees typically include closing costs (2-5% of purchase price), inspection fees, and potential mortgage fees. We provide detailed cost breakdowns.', 'Buying', 5),
('How do I list my property for sale?', 'Create an account, then use our "Sell Property" feature to list your property. Our team will review and help optimize your listing.', 'Selling', 6),
('What is the commission structure?', 'Our commission is competitive and varies by property type. Contact us for specific details about your property.', 'Selling', 7),
('Do you offer property management services?', 'Yes, we offer comprehensive property management services for landlords. Visit our Services page to learn more.', 'Services', 8);
