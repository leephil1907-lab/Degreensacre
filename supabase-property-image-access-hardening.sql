-- Restrict property image records to the owning property owner or an administrator.
-- Public visitors can read images only for publicly available listings.
DROP POLICY IF EXISTS property_images_insert_auth ON public.property_images;
DROP POLICY IF EXISTS property_images_update_auth ON public.property_images;
DROP POLICY IF EXISTS property_images_delete_auth ON public.property_images;
DROP POLICY IF EXISTS property_images_select_all ON public.property_images;

CREATE POLICY property_images_select_public_or_owner
ON public.property_images
FOR SELECT
TO anon, authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.properties p
    WHERE p.id = property_images.property_id
      AND (
        p.status = 'available'
        OR p.owner_id = (SELECT auth.uid())
        OR EXISTS (
          SELECT 1 FROM public.profiles pr
          WHERE pr.id = (SELECT auth.uid()) AND pr.is_admin = true
        )
      )
  )
);

CREATE POLICY property_images_insert_owner_or_admin
ON public.property_images
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.properties p
    WHERE p.id = property_images.property_id
      AND (
        p.owner_id = (SELECT auth.uid())
        OR EXISTS (
          SELECT 1 FROM public.profiles pr
          WHERE pr.id = (SELECT auth.uid()) AND pr.is_admin = true
        )
      )
  )
);

CREATE POLICY property_images_update_owner_or_admin
ON public.property_images
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.properties p
    WHERE p.id = property_images.property_id
      AND (
        p.owner_id = (SELECT auth.uid())
        OR EXISTS (
          SELECT 1 FROM public.profiles pr
          WHERE pr.id = (SELECT auth.uid()) AND pr.is_admin = true
        )
      )
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.properties p
    WHERE p.id = property_images.property_id
      AND (
        p.owner_id = (SELECT auth.uid())
        OR EXISTS (
          SELECT 1 FROM public.profiles pr
          WHERE pr.id = (SELECT auth.uid()) AND pr.is_admin = true
        )
      )
  )
);

CREATE POLICY property_images_delete_owner_or_admin
ON public.property_images
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.properties p
    WHERE p.id = property_images.property_id
      AND (
        p.owner_id = (SELECT auth.uid())
        OR EXISTS (
          SELECT 1 FROM public.profiles pr
          WHERE pr.id = (SELECT auth.uid()) AND pr.is_admin = true
        )
      )
  )
);
