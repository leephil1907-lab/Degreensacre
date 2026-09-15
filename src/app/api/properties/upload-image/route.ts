import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { uploadPropertyImage, BUCKETS } from '@/lib/storage';
import { validateImageFile } from '@/lib/validation';

// POST /api/properties/upload-image - Upload property image
export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized', success: false },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const propertyId = formData.get('property_id') as string;
    const displayOrder = parseInt(formData.get('display_order') as string) || 0;
    const isPrimary = formData.get('is_primary') === 'true';

    if (!file || !propertyId) {
      return NextResponse.json(
        { error: 'File and property_id are required', success: false },
        { status: 400 }
      );
    }

    // Validate file
    const validationError = validateImageFile(file);
    if (validationError) {
      return NextResponse.json(
        { error: validationError.message, success: false },
        { status: 400 }
      );
    }

    // Check if user owns the property
    const { data: property, error: propError } = await supabase
      .from('properties')
      .select('owner_id')
      .eq('id', propertyId)
      .single();

    if (propError || property.owner_id !== user.id) {
      return NextResponse.json(
        { error: 'Unauthorized to upload images for this property', success: false },
        { status: 403 }
      );
    }

    // Upload image
    const { url, path, imageId } = await uploadPropertyImage(
      propertyId,
      file,
      file.name,
      displayOrder
    );

    // Set as primary if needed
    if (isPrimary) {
      await supabase
        .from('property_images')
        .update({ is_primary: false })
        .eq('property_id', propertyId)
        .neq('id', imageId);

      await supabase
        .from('property_images')
        .update({ is_primary: true })
        .eq('id', imageId);
    }

    return NextResponse.json({
      image: { id: imageId, url, path, display_order: displayOrder, is_primary: isPrimary },
      success: true,
    });
  } catch (error: any) {
    console.error('POST /api/properties/upload-image error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to upload image', success: false },
      { status: 500 }
    );
  }
}
