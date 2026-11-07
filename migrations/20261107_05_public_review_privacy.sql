-- Public testimonials contain no email addresses or account identifiers.
REVOKE SELECT ON public.reviews FROM PUBLIC,anon;
GRANT SELECT(id,name,rating,title,message,location,created_at,is_verified_buyer,status) ON public.reviews TO anon;
DROP POLICY IF EXISTS reviews_public_read ON public.reviews;
CREATE POLICY reviews_public_read ON public.reviews FOR SELECT TO anon USING(status='approved' AND lower(email) NOT LIKE '%@example.com');
CREATE OR REPLACE VIEW public.public_reviews WITH(security_barrier=true) AS
 SELECT id,name,rating,title,message,location,created_at,is_verified_buyer
 FROM public.reviews WHERE status='approved' AND lower(email) NOT LIKE '%@example.com';
REVOKE ALL ON public.public_reviews FROM PUBLIC,anon,authenticated;
GRANT SELECT ON public.public_reviews TO anon,authenticated;
NOTIFY pgrst,'reload schema';
