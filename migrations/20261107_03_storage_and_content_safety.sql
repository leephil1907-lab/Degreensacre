-- Public listing images; sensitive documents are never a public bucket.
INSERT INTO storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
 VALUES('property-images','property-images',true,5242880,ARRAY['image/jpeg','image/png','image/webp'])
 ON CONFLICT(id) DO UPDATE SET public=true,file_size_limit=EXCLUDED.file_size_limit,allowed_mime_types=EXCLUDED.allowed_mime_types;
UPDATE storage.buckets SET public=false WHERE id IN ('property-documents','verification-documents');
DO $$DECLARE p record; BEGIN FOR p IN SELECT policyname FROM pg_policies WHERE schemaname='storage' AND tablename='objects' AND policyname LIKE 'degreen_%'
 LOOP EXECUTE format('DROP POLICY %I ON storage.objects',p.policyname); END LOOP; END$$;
CREATE POLICY degreen_images_read ON storage.objects FOR SELECT TO anon,authenticated USING(bucket_id='property-images');
CREATE POLICY degreen_images_insert ON storage.objects FOR INSERT TO authenticated WITH CHECK(bucket_id='property-images' AND (public.is_admin() OR EXISTS(SELECT 1 FROM public.properties p WHERE p.id::text=split_part(name,'/',1) AND p.owner_id=auth.uid())));
CREATE POLICY degreen_images_update ON storage.objects FOR UPDATE TO authenticated
 USING(bucket_id='property-images' AND (public.is_admin() OR EXISTS(SELECT 1 FROM public.properties p WHERE p.id::text=split_part(name,'/',1) AND p.owner_id=auth.uid() AND p.status<>'available')))
 WITH CHECK(bucket_id='property-images' AND (public.is_admin() OR EXISTS(SELECT 1 FROM public.properties p WHERE p.id::text=split_part(name,'/',1) AND p.owner_id=auth.uid() AND p.status<>'available')));
CREATE POLICY degreen_images_delete ON storage.objects FOR DELETE TO authenticated USING(bucket_id='property-images' AND (public.is_admin() OR EXISTS(SELECT 1 FROM public.properties p WHERE p.id::text=split_part(name,'/',1) AND p.owner_id=auth.uid() AND p.status<>'available')));
CREATE POLICY degreen_private_documents_read ON storage.objects FOR SELECT TO authenticated USING(bucket_id IN ('property-documents','verification-documents') AND (public.is_admin() OR (bucket_id='property-documents' AND EXISTS(SELECT 1 FROM public.properties p WHERE p.id::text=split_part(name,'/',1) AND p.owner_id=auth.uid())) OR (bucket_id='verification-documents' AND split_part(name,'/',1)=auth.uid()::text)));

-- Preserve unproven, historically pre-populated stock-photo listings for admin verification.
INSERT INTO launch_repair_private.snapshots(entity,entity_id,payload)
 SELECT 'property',p.id::text,to_jsonb(p) FROM public.properties p WHERE p.slug IN (
 'modern-4-bedroom-terrace-duplex-ikoyi','spacious-3-bedroom-flat-victoria-island',
 'executive-6-bedroom-mansion-asokoro','cozy-2-bedroom-apartment-wuse-2',
 '1000sqm-residential-land-ajah','commercial-office-space-ikeja-gra',
 '5-bedroom-semi-detached-duplex-port-harcourt','luxury-5-bedroom-detached-duplex-lekki')
 AND p.status='available' AND (p.coordinates IS NULL OR p.coordinates='{}'::jsonb)
 AND EXISTS(SELECT 1 FROM unnest(p.images) image_url WHERE image_url LIKE 'https://images.unsplash.com/%')
 ON CONFLICT DO NOTHING;
UPDATE public.properties p SET status='pending_review',verification_status='pending',featured=false,
 admin_notes=concat_ws(E'\n',NULLIF(p.admin_notes,''),'Launch audit: historical stock-photo inventory; confirm ownership, price, property photos, title documents and coordinates before republishing.'),updated_at=now()
 WHERE p.id::text IN (SELECT entity_id FROM launch_repair_private.snapshots WHERE entity='property') AND p.status='available';
NOTIFY pgrst,'reload schema';
