-- ============================================
-- DE-GREENACRES: CREATE MISSING ADMIN TABLES
-- Run this ONCE in Supabase SQL Editor
-- ============================================

-- 1. SENT EMAILS TABLE (for email composer history)
CREATE TABLE IF NOT EXISTS public.sent_emails (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  recipient_type TEXT NOT NULL DEFAULT 'all',
  recipient_count INTEGER NOT NULL DEFAULT 0,
  recipients TEXT[] DEFAULT '{}',
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  template TEXT DEFAULT 'custom',
  status TEXT DEFAULT 'sent',
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.sent_emails ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view sent emails" ON public.sent_emails FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
);
CREATE POLICY "Admins can insert sent emails" ON public.sent_emails FOR INSERT TO authenticated WITH CHECK (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
);

-- 2. SITE SETTINGS TABLE (for admin settings)
CREATE TABLE IF NOT EXISTS public.site_settings (
  id INTEGER PRIMARY KEY DEFAULT 1,
  company_name TEXT DEFAULT 'De-Greenacres Properties Limited',
  rc_number TEXT DEFAULT 'RC: 1856064',
  email TEXT DEFAULT 'degreenacrespropertieslimited@gmail.com',
  phone TEXT DEFAULT '08065019971',
  whatsapp TEXT DEFAULT '07041754800',
  address TEXT DEFAULT 'Lagos, Nigeria',
  inspection_fee INTEGER DEFAULT 20000,
  notify_new_user BOOLEAN DEFAULT true,
  notify_new_property BOOLEAN DEFAULT true,
  notify_new_enquiry BOOLEAN DEFAULT true,
  notify_payment BOOLEAN DEFAULT true,
  updated_by UUID REFERENCES auth.users(id),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT single_row CHECK (id = 1)
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read site settings" ON public.site_settings FOR SELECT TO authenticated, anon USING (true);
CREATE POLICY "Admins can update site settings" ON public.site_settings FOR UPDATE TO authenticated USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
);

-- Insert default settings row
INSERT INTO public.site_settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

-- 3. PROFILE AUTO-CREATE TRIGGER (safety net)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, last_name, phone, state, country, account_type, is_admin, is_verified)
  VALUES (
    NEW.id, NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    NEW.raw_user_meta_data->>'phone',
    NEW.raw_user_meta_data->>'state',
    COALESCE(NEW.raw_user_meta_data->>'country', 'Nigeria'),
    COALESCE(NEW.raw_user_meta_data->>'account_type', 'buyer'),
    false, false
  ) ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
