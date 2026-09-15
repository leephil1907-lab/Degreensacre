-- ============================================
-- DE-GREENACRES DATABASE SCHEMA
-- Run this in Supabase SQL Editor
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- PROFILES TABLE (extends Supabase auth.users)
-- ============================================
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  first_name TEXT,
  last_name TEXT,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  country TEXT DEFAULT 'Nigeria',
  state TEXT,
  account_type TEXT CHECK (account_type IN ('buyer', 'seller', 'agent')) DEFAULT 'buyer',
  avatar_url TEXT,
  is_admin BOOLEAN DEFAULT FALSE,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- PROPERTIES TABLE
-- ============================================
CREATE TABLE public.properties (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  property_type TEXT NOT NULL,
  type TEXT CHECK (type IN ('sale', 'rent', 'land', 'commercial', 'short-let')) NOT NULL,
  price BIGINT NOT NULL,
  price_period TEXT,
  bedrooms INTEGER DEFAULT 0,
  bathrooms INTEGER DEFAULT 0,
  sqm INTEGER DEFAULT 0,
  parking INTEGER DEFAULT 0,
  furnished BOOLEAN DEFAULT FALSE,
  serviced BOOLEAN DEFAULT FALSE,
  gated_estate BOOLEAN DEFAULT FALSE,
  address TEXT,
  area TEXT NOT NULL,
  state TEXT NOT NULL,
  coordinates JSONB,
  images TEXT[] DEFAULT '{}',
  features TEXT[] DEFAULT '{}',
  documentation TEXT,
  verification_status TEXT CHECK (verification_status IN ('verified', 'pending', 'unverified')) DEFAULT 'pending',
  status TEXT CHECK (status IN ('available', 'sold', 'rented', 'withdrawn')) DEFAULT 'available',
  featured BOOLEAN DEFAULT FALSE,
  sample BOOLEAN DEFAULT FALSE,
  agent TEXT,
  agent_phone TEXT,
  agent_email TEXT,
  owner_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  views INTEGER DEFAULT 0,
  date_added TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Properties are viewable by everyone"
  ON public.properties FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert properties"
  ON public.properties FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Owners can update own properties"
  ON public.properties FOR UPDATE
  USING (auth.uid() = owner_id);

CREATE POLICY "Owners can delete own properties"
  ON public.properties FOR DELETE
  USING (auth.uid() = owner_id);

-- ============================================
-- ENQUIRIES TABLE
-- ============================================
CREATE TABLE public.enquiries (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,
  buyer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  buyer_name TEXT NOT NULL,
  buyer_email TEXT NOT NULL,
  buyer_phone TEXT,
  message TEXT NOT NULL,
  status TEXT CHECK (status IN ('new', 'replied', 'closed')) DEFAULT 'new',
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own enquiries"
  ON public.enquiries FOR SELECT
  USING (auth.uid() = buyer_id);

CREATE POLICY "Authenticated users can create enquiries"
  ON public.enquiries FOR INSERT
  WITH CHECK (auth.uid() = buyer_id OR buyer_id IS NULL);

-- ============================================
-- SAVED PROPERTIES (Favorites)
-- ============================================
CREATE TABLE public.saved_properties (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, property_id)
);

ALTER TABLE public.saved_properties ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own saved properties"
  ON public.saved_properties FOR ALL
  USING (auth.uid() = user_id);

-- ============================================
-- PROPERTY VIEWS (Analytics)
-- ============================================
CREATE TABLE public.property_views (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  ip_address TEXT,
  user_agent TEXT,
  viewed_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.property_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert property views"
  ON public.property_views FOR INSERT
  WITH CHECK (true);

-- ============================================
-- PROPERTY ALERTS
-- ============================================
CREATE TABLE public.property_alerts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  criteria JSONB NOT NULL,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.property_alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own alerts"
  ON public.property_alerts FOR ALL
  USING (auth.uid() = user_id);

-- ============================================
-- VIEWINGS TABLE
-- ============================================
CREATE TABLE public.viewings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  scheduled_date DATE NOT NULL,
  scheduled_time TIME NOT NULL,
  status TEXT CHECK (status IN ('scheduled', 'completed', 'cancelled')) DEFAULT 'scheduled',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.viewings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own viewings"
  ON public.viewings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can create viewings"
  ON public.viewings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================
-- DEVELOPMENTS TABLE
-- ============================================
CREATE TABLE public.developments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  developer TEXT NOT NULL,
  description TEXT,
  location TEXT NOT NULL,
  state TEXT NOT NULL,
  status TEXT CHECK (status IN ('planning', 'under-construction', 'completed', 'sold-out')) DEFAULT 'planning',
  completion_date TEXT,
  total_units INTEGER DEFAULT 0,
  available_units INTEGER DEFAULT 0,
  unit_types JSONB DEFAULT '[]',
  amenities TEXT[] DEFAULT '{}',
  payment_plans JSONB DEFAULT '[]',
  gallery TEXT[] DEFAULT '{}',
  features TEXT[] DEFAULT '{}',
  documentation TEXT,
  site_inspection BOOLEAN DEFAULT FALSE,
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.developments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Developments are viewable by everyone"
  ON public.developments FOR SELECT
  USING (true);

-- ============================================
-- CONTACT MESSAGES TABLE
-- ============================================
CREATE TABLE public.contact_messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT CHECK (status IN ('new', 'read', 'replied')) DEFAULT 'new',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit contact messages"
  ON public.contact_messages FOR INSERT
  WITH CHECK (true);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX idx_properties_state ON public.properties(state);
CREATE INDEX idx_properties_type ON public.properties(type);
CREATE INDEX idx_properties_status ON public.properties(status);
CREATE INDEX idx_properties_featured ON public.properties(featured);
CREATE INDEX idx_properties_price ON public.properties(price);
CREATE INDEX idx_enquiries_status ON public.enquiries(status);
CREATE INDEX idx_property_views_property ON public.property_views(property_id);
CREATE INDEX idx_saved_properties_user ON public.saved_properties(user_id);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Increment property views
CREATE OR REPLACE FUNCTION increment_property_views(property_uuid UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.properties
  SET views = views + 1
  WHERE id = property_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_properties_updated_at
  BEFORE UPDATE ON public.properties
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_enquiries_updated_at
  BEFORE UPDATE ON public.enquiries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
