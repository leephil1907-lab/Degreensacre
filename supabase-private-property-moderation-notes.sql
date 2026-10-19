-- Keep moderation notes separate from public property records.
-- The migration has been applied to Supabase project rvwirpfclysapqtnrlvx.

BEGIN;

ALTER TABLE public.properties DROP COLUMN IF EXISTS admin_notes;

CREATE TABLE IF NOT EXISTS public.property_moderation_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  admin_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  note text NOT NULL CHECK (length(trim(note)) > 0 AND length(note) <= 5000),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS property_moderation_notes_property_created_idx
  ON public.property_moderation_notes (property_id, created_at DESC);

ALTER TABLE public.property_moderation_notes ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.property_moderation_notes FROM PUBLIC, anon, authenticated;

COMMIT;