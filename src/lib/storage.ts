import { createServerSupabaseClient, createAdminSupabaseClient } from './supabase-server';

// Storage bucket names
export const BUCKETS = {
  PROPERTY_IMAGES: 'property-images',
  PROPERTY_DOCUMENTS: 'property-documents',
  VERIFICATION_DOCUMENTS: 'verification-documents',
  PROFILE_AVATARS: 'profile-avatars',
  AGENCY_LOGOS: 'agency-logos',
  AGENT_PHOTOS: 'agent-photos',
  DEVELOPMENT_IMAGES: 'development-images',
} as const;

// Upload an image to Supabase Storage
export async function uploadImage(
  bucket: string,
  file: File | Blob,
  path: string
): Promise<{ url: string; path: string }> {
  const supabase = await createAdminSupabaseClient();
  
  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) throw error;

  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(path);

  return { url: publicUrl, path };
}

// Upload a document to Supabase Storage
export async function uploadDocument(
  bucket: string,
  file: File | Blob,
  path: string
): Promise<{ url: string; path: string }> {
  const supabase = await createAdminSupabaseClient();
  
  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) throw error;

  // Create signed URL for private documents
  const { data, error: urlError } = await supabase.storage
    .from(bucket)
    .createSignedUrl(path, 60 * 60 * 24 * 365); // 1 year

  if (urlError) throw urlError;

  return { url: data.signedUrl, path };
}

// Delete a file from storage
export async function deleteFile(bucket: string, path: string): Promise<void> {
  const supabase = await createAdminSupabaseClient();
  
  const { error } = await supabase.storage
    .from(bucket)
    .remove([path]);

  if (error) throw error;
}

// Get public URL for a file
export function getPublicUrl(bucket: string, path: string): string {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  return `${supabaseUrl}/storage/v1/object/public/${bucket}/${path}`;
}

// Generate unique file path
export function generateFilePath(
  bucket: string,
  originalName: string,
  entityId?: string
): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  const ext = originalName.split('.').pop() || 'bin';
  const baseName = originalName.replace(/\.[^.]+$/, '').replace(/[^a-zA-Z0-9-_]/g, '-').toLowerCase();
  
  const entityPrefix = entityId ? `${entityId}/` : '';
  return `${entityPrefix}${timestamp}-${random}-${baseName}.${ext}`;
}

// Property image upload helper
export async function uploadPropertyImage(
  propertyId: string,
  file: File | Blob,
  originalName: string,
  order: number = 0
): Promise<{ url: string; path: string; imageId: string }> {
  const supabase = await createAdminSupabaseClient();
  
  const path = generateFilePath(BUCKETS.PROPERTY_IMAGES, originalName, propertyId);
  const { url } = await uploadImage(BUCKETS.PROPERTY_IMAGES, file, path);
  
  const { data, error } = await supabase
    .from('property_images')
    .insert({
      property_id: propertyId,
      url,
      storage_path: path,
      display_order: order,
      is_primary: order === 0,
    })
    .select()
    .single();

  if (error) throw error;

  return { url, path, imageId: data.id };
}

// Property document upload helper
export async function uploadPropertyDocument(
  propertyId: string,
  file: File | Blob,
  originalName: string,
  documentType: string,
  uploadedBy: string
): Promise<{ url: string; path: string; documentId: string }> {
  const supabase = await createAdminSupabaseClient();
  
  const path = generateFilePath(BUCKETS.PROPERTY_DOCUMENTS, originalName, propertyId);
  const { url } = await uploadDocument(BUCKETS.PROPERTY_DOCUMENTS, file, path);
  
  const { data, error } = await supabase
    .from('property_documents')
    .insert({
      property_id: propertyId,
      name: originalName,
      document_type: documentType,
      url,
      storage_path: path,
      uploaded_by: uploadedBy,
      is_public: false,
    })
    .select()
    .single();

  if (error) throw error;

  return { url, path, documentId: data.id };
}

// Profile avatar upload helper
export async function uploadProfileAvatar(
  userId: string,
  file: File | Blob,
  originalName: string
): Promise<{ url: string; path: string }> {
  const supabase = await createAdminSupabaseClient();
  
  // Delete old avatar if exists
  const { data: profile } = await supabase
    .from('profiles')
    .select('avatar_url')
    .eq('id', userId)
    .single();

  if (profile?.avatar_url) {
    const oldPath = profile.avatar_url.split('/').pop();
    if (oldPath) {
      try {
        await deleteFile(BUCKETS.PROFILE_AVATARS, `${userId}/${oldPath}`);
      } catch {
        // Ignore error if old file doesn't exist
      }
    }
  }
  
  const path = generateFilePath(BUCKETS.PROFILE_AVATARS, originalName, userId);
  const { url } = await uploadImage(BUCKETS.PROFILE_AVATARS, file, path);
  
  await supabase
    .from('profiles')
    .update({ avatar_url: url })
    .eq('id', userId);

  return { url, path };
}

// Verification document upload helper
export async function uploadVerificationDocument(
  verificationId: string,
  file: File | Blob,
  originalName: string,
  documentType: string,
  uploadedBy: string
): Promise<{ url: string; path: string; documentId: string }> {
  const supabase = await createAdminSupabaseClient();
  
  const path = generateFilePath(BUCKETS.VERIFICATION_DOCUMENTS, originalName, verificationId);
  const { url } = await uploadDocument(BUCKETS.VERIFICATION_DOCUMENTS, file, path);
  
  const { data, error } = await supabase
    .from('verification_documents')
    .insert({
      verification_id: verificationId,
      name: originalName,
      document_type: documentType,
      url,
      storage_path: path,
      uploaded_by: uploadedBy,
    })
    .select()
    .single();

  if (error) throw error;

  return { url, path, documentId: data.id };
}
