-- Remove exact duplicate indexes reported by Supabase advisors.
-- Keep one equivalent index for each column so query support is preserved.
DROP INDEX IF EXISTS public.idx_enquiries_buyer_id;
DROP INDEX IF EXISTS public.idx_enquiries_property_id;
DROP INDEX IF EXISTS public.properties_owner_idx;
