-- ============================================
-- DE-GREENACRES: ADD YOUR REAL PROPERTY LISTINGS
-- Run this in Supabase SQL Editor
-- ============================================

-- TEMPLATE: Copy this block for each property
-- Change all the values to match your actual property

-- PROPERTY 1
INSERT INTO public.properties (
  slug, title, description, property_type, type, price, price_period,
  bedrooms, bathrooms, sqm, parking, furnished, serviced, gated_estate,
  area, state, lga, address, features, documentation, status,
  verification_status, featured, owner_id, date_added
) VALUES (
  '600sqm-land-shelter-afrique-uyo',          -- slug (unique, lowercase, hyphens)
  '600sqm Residential Land in Shelter Afrique', -- title
  'Well-located 600sqm plot of dry land in prestigious Shelter Afrique Estate, Uyo. Excellent for residential development with good road access, estate security, and all utilities available. Government approved layout with clear boundaries.', -- description
  'Land',                                      -- property_type (House, Apartment, Land, Commercial, Duplex, etc.)
  'land',                                      -- type (sale, rent, land, commercial, short-let)
  45000000,                                    -- price in Naira
  NULL,                                        -- price_period (month, year, or NULL for sale/land)
  0,                                           -- bedrooms
  0,                                           -- bathrooms
  600,                                         -- sqm
  0,                                           -- parking
  false,                                       -- furnished
  false,                                       -- serviced
  true,                                        -- gated_estate
  'Shelter Afrique',                           -- area
  'Akwa Ibom',                                 -- state
  'Uyo',                                       -- lga
  'Plot 45, Shelter Afrique Estate, Uyo',      -- full address
  ARRAY['Dry Land', 'Good Road Access', 'Estate Security', 'Government Approved', 'Utilities Available'], -- features
  'C of O',                                    -- documentation (C of O, Governor's Consent, Excision, Gazette, etc.)
  'available',                                 -- status (available, sold, rented, pending, archived)
  'verified',                                  -- verification_status (verified, pending, unverified)
  true,                                        -- featured
  '29a52273-57da-4fbb-9718-10837b55b1a5',     -- owner_id (your admin user ID)
  NOW()                                        -- date_added
);

-- PROPERTY 2
INSERT INTO public.properties (
  slug, title, description, property_type, type, price, price_period,
  bedrooms, bathrooms, sqm, parking, furnished, serviced, gated_estate,
  area, state, lga, address, features, documentation, status,
  verification_status, featured, owner_id, date_added
) VALUES (
  '1000sqm-coastal-road-uyo',
  '1000sqm Land along Uyo Coastal Road',
  'Prime 1000sqm plot along the Uyo Coastal Highway. Excellent frontage with tarred road access. Surrounded by residential and commercial developments. Ideal for residential or mixed-use investment. Payment plan available.',
  'Land',
  'sale',
  85000000,
  NULL,
  0,
  0,
  1000,
  0,
  false,
  false,
  false,
  'Coastal Road',
  'Akwa Ibom',
  'Uyo',
  'Along Coastal Highway, Uyo',
  ARRAY['Dry Land', 'Road Frontage', 'Coastal Highway Access', 'Residential/Commercial', 'Utilities Available', 'Payment Plan Available'],
  'C of O',
  'available',
  'verified',
  true,
  '29a52273-57da-4fbb-9718-10837b55b1a5',
  NOW()
);

-- PROPERTY 3
INSERT INTO public.properties (
  slug, title, description, property_type, type, price, price_period,
  bedrooms, bathrooms, sqm, parking, furnished, serviced, gated_estate,
  area, state, lga, address, features, documentation, status,
  verification_status, featured, owner_id, date_added
) VALUES (
  '5-bedroom-duplex-lekki-lagos',
  '5 Bedroom Detached Duplex with BQ in Lekki',
  'Magnificent newly built 5 bedroom fully detached duplex with swimming pool, elevator, and smart home automation in Chevron Drive, Lekki. All rooms ensuite, spacious living areas, modern kitchen with island, beautifully landscaped compound.',
  'Detached Duplex',
  'sale',
  180000000,
  NULL,
  5,
  6,
  450,
  4,
  false,
  true,
  true,
  'Chevron Drive',
  'Lagos',
  'Lekki',
  'Plot 15, Greenacres Estate, Chevron Drive, Lekki',
  ARRAY['Swimming Pool', 'Elevator', 'Smart Home', 'All Rooms Ensuite', 'Boys Quarter', 'Gym', 'CCTV', '24/7 Security', 'Fiber Internet'],
  'C of O',
  'available',
  'verified',
  true,
  '29a52273-57da-4fbb-9718-10837b55b1a5',
  NOW()
);

-- ============================================
-- ADD PROPERTY IMAGES
-- After inserting properties, add their images:
-- ============================================

-- Replace 'PROPERTY_UUID_HERE' with the actual UUID from the properties table
-- You can find it by running: SELECT id, title FROM public.properties;

-- Example:
-- INSERT INTO public.property_images (property_id, url, display_order, is_primary)
-- VALUES 
--   ('PROPERTY_UUID_HERE', 'https://your-image-url.com/photo1.jpg', 0, true),
--   ('PROPERTY_UUID_HERE', 'https://your-image-url.com/photo2.jpg', 1, false),
--   ('PROPERTY_UUID_HERE', 'https://your-image-url.com/photo3.jpg', 2, false);

-- ============================================
-- USEFUL QUERIES
-- ============================================

-- View all your properties:
-- SELECT id, title, type, price, state, status FROM public.properties ORDER BY date_added DESC;

-- Update a property price:
-- UPDATE public.properties SET price = 50000000 WHERE slug = 'your-property-slug';

-- Mark a property as sold:
-- UPDATE public.properties SET status = 'sold' WHERE slug = 'your-property-slug';

-- Delete a property:
-- DELETE FROM public.properties WHERE slug = 'your-property-slug';
