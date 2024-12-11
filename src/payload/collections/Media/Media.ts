import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  labels: {
    singular: {
      en: 'Media',
      ru: 'Медиа',
    },
    plural: {
      en: 'Media',
      ru: 'Медиа',
    },
  },
  upload: {
    adminThumbnail: "thumbnail",
    focalPoint: true,
    imageSizes: [
      {
        name: "thumbnail",
        width: 300,
      },
      {
        name: 'sq',
        width: 500,
        height: 500,
      },
      {
        name: "sm",
        width: 600
      },
      {
        name: "md",
        width: 900
      },
      {
        name: "lg",
        width: 1400
      },
      {
        name: "xl",
        width: 1920
      },
      {
        name: 'og',
        width: 1200,
        height: 630,
        crop: 'center'
      }
    ]
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],
}
