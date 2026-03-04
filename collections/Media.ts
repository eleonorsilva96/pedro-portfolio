import type { CollectionConfig } from 'payload';

export const Media: CollectionConfig = {
  slug: 'media',
  // Allow standard web images and web-friendly videos
  upload: {
    mimeTypes: [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/svg+xml',
      'video/mp4',
      'video/webm',
    ],
  },
  // This single line enables the drag-and-drop interface
  access: {
    read: () => true, // Allows your frontend to display the images
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      label: 'Alternative Text',
    },
  ],
};
