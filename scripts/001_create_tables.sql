-- Properties table
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
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_properties_city ON properties(city);
CREATE INDEX IF NOT EXISTS idx_properties_property_type ON properties(property_type);
CREATE INDEX IF NOT EXISTS idx_properties_status ON properties(status);
CREATE INDEX IF NOT EXISTS idx_properties_price ON properties(price);
CREATE INDEX IF NOT EXISTS idx_properties_user_id ON properties(user_id);

-- Favorites table for saved properties
CREATE TABLE IF NOT EXISTS favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, property_id)
);

CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);

-- Property inquiries/contacts
CREATE TABLE IF NOT EXISTS inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_inquiries_property_id ON inquiries(property_id);

-- User profiles
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

-- Properties policies (public read, authenticated write for own properties)
CREATE POLICY "Properties are viewable by everyone" ON properties FOR SELECT USING (true);
CREATE POLICY "Users can insert their own properties" ON properties FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own properties" ON properties FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own properties" ON properties FOR DELETE USING (auth.uid() = user_id);

-- Favorites policies
CREATE POLICY "Users can view their own favorites" ON favorites FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can add favorites" ON favorites FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can remove their favorites" ON favorites FOR DELETE USING (auth.uid() = user_id);

-- Inquiries policies
CREATE POLICY "Property owners can view inquiries" ON inquiries FOR SELECT USING (
  EXISTS (SELECT 1 FROM properties WHERE properties.id = inquiries.property_id AND properties.user_id = auth.uid())
);
CREATE POLICY "Anyone can create inquiries" ON inquiries FOR INSERT WITH CHECK (true);

-- Profiles policies
CREATE POLICY "Profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Auto-create profile on signup trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NULL)
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Insert sample properties
INSERT INTO properties (title, description, price, property_type, status, bedrooms, bathrooms, kitchens, garages, area_sqft, address, city, country, latitude, longitude, image_url, rating, featured) VALUES
('Dream House Reality', 'A beautiful modern home with stunning architecture and premium finishes throughout.', 367000, 'house', 'for_sale', 4, 3, 2, 1, 2920, 'Jl. Sudirman No. 14', 'Jakarta', 'Indonesia', -6.2088, 106.8456, 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800', 4.9, true),
('Atap Langit Homes', 'Luxurious apartment with panoramic city views and modern amenities.', 278000, 'apartment', 'for_sale', 3, 2, 1, 1, 1850, 'Jl. Gatot Subroto', 'Jakarta', 'Indonesia', -6.2297, 106.8295, 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800', 4.7, false),
('Midnight Ridge Villa', 'Experience a peaceful escape at this modern retreat set on a quiet hillside with stunning views.', 452000, 'villa', 'for_sale', 6, 4, 2, 2, 3500, 'Jl. Thamrin', 'Jakarta', 'Indonesia', -6.1944, 106.8229, 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800', 4.8, true),
('Unity Urban Homes', 'Contemporary urban living with smart home features and sustainable design.', 278000, 'house', 'for_sale', 4, 2, 1, 1, 2200, 'Jl. Ahmad Yani', 'Jakarta', 'Indonesia', -6.2615, 106.8106, 'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=800', 4.7, false),
('Dream House', 'Classic design meets modern comfort in this stunning family home.', 367000, 'house', 'for_sale', 5, 3, 2, 2, 2800, 'Jl. Diponegoro', 'Semarang', 'Indonesia', -6.9666, 110.4196, 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800', 4.9, false),
('Lakeland Thick Villa', 'Stunning lakefront property with private dock and breathtaking water views.', 278000, 'villa', 'for_sale', 4, 3, 1, 1, 2600, 'Jl. Pemuda', 'Jakarta', 'Indonesia', -6.1751, 106.8272, 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800', 4.7, false),
('Green Valley Estate', 'Eco-friendly home surrounded by lush gardens and natural beauty.', 425000, 'house', 'for_sale', 5, 4, 2, 2, 3200, 'Jl. Pahlawan', 'Bandung', 'Indonesia', -6.9175, 107.6191, 'https://images.unsplash.com/photo-1602941525421-8f8b81d3edbb?w=800', 4.6, true),
('Skyline Penthouse', 'Exclusive penthouse living with private rooftop terrace and infinity pool.', 890000, 'apartment', 'for_sale', 3, 3, 1, 2, 2100, 'Jl. Kuningan', 'Jakarta', 'Indonesia', -6.2350, 106.8273, 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800', 5.0, true);
