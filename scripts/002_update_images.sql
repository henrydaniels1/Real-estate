-- Update properties with better images
UPDATE properties SET 
  image_url = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
  images = ARRAY[
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80'
  ]
WHERE title = 'Dream House Realty';

UPDATE properties SET 
  image_url = 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80',
  images = ARRAY[
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80',
    'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80',
    'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&q=80'
  ]
WHERE title = 'Atap Langit Homes';

UPDATE properties SET 
  image_url = 'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=800&q=80',
  images = ARRAY[
    'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=800&q=80',
    'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&q=80',
    'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&q=80'
  ]
WHERE title = 'Midnight Ridge Villa';

UPDATE properties SET 
  image_url = 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&q=80',
  images = ARRAY[
    'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&q=80',
    'https://images.unsplash.com/photo-1600573472591-ee6981cf81f0?w=800&q=80',
    'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80'
  ]
WHERE title = 'Unity Urban Homes';

UPDATE properties SET 
  image_url = 'https://images.unsplash.com/photo-1600047509358-9dc75507daeb?w=800&q=80',
  images = ARRAY[
    'https://images.unsplash.com/photo-1600047509358-9dc75507daeb?w=800&q=80',
    'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800&q=80',
    'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&q=80'
  ]
WHERE title = 'Dream House';

UPDATE properties SET 
  image_url = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
  images = ARRAY[
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
    'https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=800&q=80',
    'https://images.unsplash.com/photo-1600566753151-384129cf4e3e?w=800&q=80'
  ]
WHERE title = 'Lakeland Thick Villa';
