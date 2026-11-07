\set ON_ERROR_STOP on
-- Read-only and rolled-back synthetic DML in the isolated local database only.
BEGIN;
SET LOCAL ROLE anon;
DO $$BEGIN
 IF (SELECT count(*) FROM public.reviews)<>1 THEN RAISE EXCEPTION 'Seed review leaked or genuine review disappeared'; END IF;
 IF (SELECT settings->>'address' FROM public.site_settings WHERE id=1)<>'Original address' THEN RAISE EXCEPTION 'Settings were not preserved'; END IF;
END$$;
INSERT INTO public.reviews(id,email,name,rating,message,status,is_verified_buyer)
 VALUES('00000000-0000-4000-8000-000000000020','test@local.test','Test',5,'Direct request','approved',true);
RESET ROLE;
DO $$BEGIN IF NOT EXISTS(SELECT 1 FROM reviews WHERE id='00000000-0000-4000-8000-000000000020' AND status='pending' AND NOT is_verified_buyer) THEN RAISE EXCEPTION 'Public approval bypass'; END IF; END$$;
SET LOCAL ROLE authenticated;
SELECT set_config('request.jwt.claim.sub','00000000-0000-4000-8000-000000000002',true);
DO $$BEGIN IF (SELECT count(*) FROM profiles)<>1 THEN RAISE EXCEPTION 'Other profiles leaked'; END IF; END$$;
UPDATE profiles SET is_admin=true,is_verified=true,email='spoof@local.test' WHERE id=auth.uid();
DO $$BEGIN IF EXISTS(SELECT 1 FROM profiles WHERE id=auth.uid() AND (is_admin OR is_verified OR email='spoof@local.test')) THEN RAISE EXCEPTION 'Profile escalation'; END IF; END$$;
UPDATE properties SET title='Edited by owner' WHERE id='00000000-0000-4000-8000-000000000010';
DO $$BEGIN IF NOT EXISTS(SELECT 1 FROM properties WHERE id='00000000-0000-4000-8000-000000000010' AND status='pending_review') THEN RAISE EXCEPTION 'Owner edit not moderated'; END IF;
 BEGIN UPDATE properties SET status='available' WHERE id='00000000-0000-4000-8000-000000000010'; RAISE EXCEPTION 'Owner self-publication allowed'; EXCEPTION WHEN raise_exception THEN IF SQLERRM='Owner self-publication allowed' THEN RAISE; END IF; END;
END$$;
INSERT INTO conversations(id,created_by) VALUES('00000000-0000-4000-8000-000000000030',auth.uid());
INSERT INTO messages(id,conversation_id,sender_id,recipient_id,content) VALUES('00000000-0000-4000-8000-000000000031','00000000-0000-4000-8000-000000000030',auth.uid(),'00000000-0000-4000-8000-000000000003','Local message');
DO $$BEGIN
 BEGIN INSERT INTO messages(conversation_id,sender_id,recipient_id,content) VALUES('00000000-0000-4000-8000-000000000030',auth.uid(),'00000000-0000-4000-8000-000000000001','Uninvited third party'); RAISE EXCEPTION 'Third party injection allowed'; EXCEPTION WHEN insufficient_privilege THEN NULL; END;
END$$;
SELECT set_config('request.jwt.claim.sub','00000000-0000-4000-8000-000000000003',true);
DO $$BEGIN IF (SELECT count(*) FROM messages)<>1 THEN RAISE EXCEPTION 'Recipient cannot read message'; END IF;
 IF (SELECT count(*) FROM conversations)<>1 THEN RAISE EXCEPTION 'Recipient cannot access conversation'; END IF;
 IF (SELECT count(*) FROM public.conversation_profile_summaries(ARRAY['00000000-0000-4000-8000-000000000002'::uuid]))<>1 THEN RAISE EXCEPTION 'Missing safe profile summary'; END IF;
 BEGIN UPDATE messages SET content='Tampered' WHERE id='00000000-0000-4000-8000-000000000031'; RAISE EXCEPTION 'Recipient altered message content'; EXCEPTION WHEN raise_exception THEN IF SQLERRM='Recipient altered message content' THEN RAISE; END IF; END;
END$$;
UPDATE messages SET is_read=true WHERE id='00000000-0000-4000-8000-000000000031';
INSERT INTO messages(conversation_id,sender_id,recipient_id,content) VALUES('00000000-0000-4000-8000-000000000030',auth.uid(),'00000000-0000-4000-8000-000000000002','Reply');
SELECT set_config('request.jwt.claim.sub','00000000-0000-4000-8000-000000000001',true);
DO $$BEGIN IF (SELECT count(*) FROM profiles)<>3 THEN RAISE EXCEPTION 'Administrator cannot manage profiles'; END IF; END$$;
UPDATE profiles SET is_verified=true WHERE id='00000000-0000-4000-8000-000000000002';
DO $$BEGIN IF NOT EXISTS(SELECT 1 FROM profiles WHERE id='00000000-0000-4000-8000-000000000002' AND is_verified) THEN RAISE EXCEPTION 'Admin verification blocked'; END IF; END$$;
RESET ROLE;
SELECT set_config('request.jwt.claim.sub','',true);
INSERT INTO auth.users(id,email,raw_user_meta_data) VALUES('00000000-0000-4000-8000-000000000004','signup@local.test','{"account_type":"admin","is_admin":true}');
DO $$BEGIN IF NOT EXISTS(SELECT 1 FROM profiles WHERE id='00000000-0000-4000-8000-000000000004' AND NOT is_admin AND account_type='buyer') THEN RAISE EXCEPTION 'Signup privilege injection'; END IF; END$$;
-- An unrelated, newly signed-up user cannot see or join an existing thread.
SET LOCAL ROLE authenticated;
SELECT set_config('request.jwt.claim.sub','00000000-0000-4000-8000-000000000004',true);
DO $$BEGIN
 IF EXISTS(SELECT 1 FROM messages) OR EXISTS(SELECT 1 FROM conversations) THEN RAISE EXCEPTION 'Outsider conversation disclosure'; END IF;
 IF EXISTS(SELECT 1 FROM public.conversation_profile_summaries(ARRAY['00000000-0000-4000-8000-000000000002'::uuid])) THEN RAISE EXCEPTION 'Unrelated profile disclosed'; END IF;
 BEGIN INSERT INTO conversation_participants(conversation_id,user_id) VALUES('00000000-0000-4000-8000-000000000030',auth.uid()); RAISE EXCEPTION 'Outsider joined thread'; EXCEPTION WHEN insufficient_privilege THEN NULL; END;
 BEGIN INSERT INTO storage.objects(bucket_id,name) VALUES('property-images','00000000-0000-4000-8000-000000000010/outsider.jpg'); RAISE EXCEPTION 'Outsider uploaded listing image'; EXCEPTION WHEN insufficient_privilege THEN NULL; END;
 BEGIN INSERT INTO notifications(user_id,type,data) VALUES('00000000-0000-4000-8000-000000000003','new_message','{"conversation_id":"00000000-0000-4000-8000-000000000030","sender_id":"00000000-0000-4000-8000-000000000004"}'); RAISE EXCEPTION 'Outsider spoofed notification'; EXCEPTION WHEN insufficient_privilege THEN NULL; END;
END$$;
SELECT set_config('request.jwt.claim.sub','00000000-0000-4000-8000-000000000002',true);
INSERT INTO storage.objects(bucket_id,name) VALUES('property-images','00000000-0000-4000-8000-000000000010/owner.jpg');
INSERT INTO property_images(property_id,url) VALUES('00000000-0000-4000-8000-000000000010','https://local.test/owner.jpg');
RESET ROLE;
SELECT set_config('request.jwt.claim.sub','',true);
INSERT INTO public.articles(slug,title,excerpt,content,category,image,status) VALUES('local-draft','Draft','Draft','Draft','Property','/property-placeholder.svg','draft');
SET LOCAL ROLE anon;
DO $$BEGIN IF EXISTS(SELECT 1 FROM articles WHERE slug='local-draft') THEN RAISE EXCEPTION 'Article draft disclosed'; END IF; END$$;
RESET ROLE;
ROLLBACK;
SELECT 'SECURITY_REHEARSAL_PASS: preserved data, pending reviews, no self-promotion, owner re-moderation, admin visibility, messaging isolation, safe profile summaries, read-state-only updates, safe signup' AS result;
