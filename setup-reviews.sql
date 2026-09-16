-- ============================================
-- DE-GREENACRES: CREATE REVIEWS TABLE
-- Run this in Supabase SQL Editor
-- ============================================

CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  message TEXT NOT NULL,
  location TEXT,
  property_id UUID REFERENCES public.properties(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  is_verified_buyer BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Anyone can read approved reviews
CREATE POLICY "Anyone can read approved reviews" ON public.reviews FOR SELECT TO authenticated, anon USING (status = 'approved');

-- Anyone can insert reviews
CREATE POLICY "Anyone can insert reviews" ON public.reviews FOR INSERT TO authenticated, anon WITH CHECK (true);

-- Admins can manage all reviews
CREATE POLICY "Admins can manage reviews" ON public.reviews FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
);

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_reviews_status ON public.reviews(status);
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON public.reviews(created_at DESC);

-- Insert some seed reviews so the page isn't empty
INSERT INTO public.reviews (name, email, rating, title, message, location, status) VALUES
  ('Chinedu Okafor', 'chinedu@example.com', 5, 'Excellent service', 'De-Greenacres helped me find and verify a plot in Uyo. The documentation review process gave me confidence to proceed. Highly recommended for anyone investing in Akwa Ibom.', 'Lagos', 'approved'),
  ('Adaeze Nwankwo', 'adaeze@example.com', 5, 'Professional and transparent', 'I was looking for land in the Southeast as a diaspora Nigerian. De-Greenacres handled everything professionally — from virtual tours to document verification. I felt secure throughout the process.', 'London, UK', 'approved'),
  ('Emeka Obi', 'emeka@example.com', 4, 'Great property selection', 'Found a beautiful duplex through De-Greenacres in Lekki. The inspection process was smooth and the agent was very responsive on WhatsApp. Would use again.', 'Lagos', 'approved'),
  ('Fatima Abdullahi', 'fatima@example.com', 5, 'Trustworthy platform', 'As a first-time buyer, I was nervous about property scams. De-Greenacres'' verification process and CAC registration gave me the confidence to invest. The ₦20K inspection fee is worth every naira.', 'Abuja', 'approved'),
  ('Tunde Bakare', 'tunde@example.com', 5, 'Seamless experience', 'From browsing listings to booking an inspection to closing the deal — everything was smooth. The team is responsive and professional. Best property platform in Nigeria.', 'Port Harcourt', 'approved'),
  ('Grace Udo', 'grace@example.com', 4, 'Good land options in Uyo', 'Purchased a 600sqm plot through De-Greenacres in Shelter Afrique. Documentation was clean and the payment plan option helped. Only wish there were more listings in my area.', 'Uyo', 'approved');
