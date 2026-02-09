# Supabase Storage Setup Guide

## Required Storage Buckets

To enable image uploads in the admin panel, you need to create the following storage buckets in your Supabase project:

### 1. Create Storage Buckets

Go to your Supabase Dashboard → Storage → Create new bucket

Create these buckets:
- `properties` - For property images
- `blog` - For blog post featured images
- `hero` - For hero section background images
- `avatars` - For testimonial avatars
- `images` - For general images (fallback)

### 2. Set Bucket Policies

For each bucket, you need to set the appropriate policies to allow:
- **Public access** for reading (so images can be displayed on your website)
- **Authenticated access** for uploading (so only logged-in admins can upload)

#### SQL Policy Setup

Run this SQL in your Supabase SQL Editor for each bucket (replace `BUCKET_NAME` with actual bucket name):

```sql
-- Allow public read access
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'BUCKET_NAME' );

-- Allow authenticated users to upload
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'BUCKET_NAME' 
  AND auth.role() = 'authenticated'
);

-- Allow authenticated users to update their uploads
CREATE POLICY "Authenticated users can update"
ON storage.objects FOR UPDATE
USING ( bucket_id = 'BUCKET_NAME' AND auth.role() = 'authenticated' );

-- Allow authenticated users to delete
CREATE POLICY "Authenticated users can delete"
ON storage.objects FOR DELETE
USING ( bucket_id = 'BUCKET_NAME' AND auth.role() = 'authenticated' );
```

### 3. Quick Setup (All Buckets at Once)

Run this SQL to create all buckets and policies at once:

```sql
-- Create buckets
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('properties', 'properties', true),
  ('blog', 'blog', true),
  ('hero', 'hero', true),
  ('avatars', 'avatars', true),
  ('images', 'images', true)
ON CONFLICT (id) DO NOTHING;

-- Create policies for all buckets
DO $$
DECLARE
  bucket_name text;
BEGIN
  FOREACH bucket_name IN ARRAY ARRAY['properties', 'blog', 'hero', 'avatars', 'images']
  LOOP
    -- Public read access
    EXECUTE format('
      CREATE POLICY "Public Access %s"
      ON storage.objects FOR SELECT
      USING ( bucket_id = %L )
    ', bucket_name, bucket_name);
    
    -- Authenticated upload
    EXECUTE format('
      CREATE POLICY "Authenticated upload %s"
      ON storage.objects FOR INSERT
      WITH CHECK ( bucket_id = %L AND auth.role() = ''authenticated'' )
    ', bucket_name, bucket_name);
    
    -- Authenticated update
    EXECUTE format('
      CREATE POLICY "Authenticated update %s"
      ON storage.objects FOR UPDATE
      USING ( bucket_id = %L AND auth.role() = ''authenticated'' )
    ', bucket_name, bucket_name);
    
    -- Authenticated delete
    EXECUTE format('
      CREATE POLICY "Authenticated delete %s"
      ON storage.objects FOR DELETE
      USING ( bucket_id = %L AND auth.role() = ''authenticated'' )
    ', bucket_name, bucket_name);
  END LOOP;
END $$;
```

### 4. Verify Setup

After running the SQL:
1. Go to Storage in Supabase Dashboard
2. You should see all 5 buckets listed
3. Each bucket should show as "Public" (for read access)
4. Try uploading an image from the admin panel to test

## Features Added

### Image Upload Component
- ✅ Upload from device (laptop/phone)
- ✅ Drag & drop support
- ✅ URL input fallback
- ✅ Image preview
- ✅ File size validation (max 5MB)
- ✅ Loading states
- ✅ Error handling with toast notifications

### Updated Admin Pages
- ✅ Properties - Main image upload
- ✅ Blog - Featured image upload
- ✅ Hero - Background image upload
- ✅ Testimonials - Avatar image upload

## Usage Tips

1. **File Size**: Images are limited to 5MB for optimal performance
2. **Formats**: Accepts all image formats (jpg, png, gif, webp, etc.)
3. **Mobile**: Works on both desktop and mobile devices
4. **Fallback**: You can still use image URLs if you prefer
5. **Preview**: Images show a preview before saving

## Troubleshooting

### Upload fails with "Failed to upload image"
- Check that the storage bucket exists
- Verify bucket policies are set correctly
- Ensure you're logged in as an authenticated user

### Images don't display after upload
- Check that the bucket is set to "public"
- Verify the public read policy is enabled

### Can't create buckets
- Make sure you have admin access to your Supabase project
- Try creating buckets manually through the dashboard first
