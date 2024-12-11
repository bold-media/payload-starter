import { slug } from '@/payload/fields/slug'
import { syncPathname } from '@/payload/hooks/syncPathname'
import { en } from '@/payload/i18n/en'
import { ru } from '@/payload/i18n/ru'
import { CollectionConfig } from 'payload'

import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'
import { createBreadcrumbsField, createParentField } from '@payloadcms/plugin-nested-docs'
import { BlocksFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import { Banner } from '@/payload/blocks/Banner/Banner.config'
import { access } from '@/payload/access'

export const Page: CollectionConfig = {
  slug: 'page',
  labels: {
    singular: {
      en: 'Page',
      ru: 'Страница',
    },
    plural: {
      en: 'Pages',
      ru: 'Страницы',
    },
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'publishedAt', 'updatedAt'],
  },
  defaultPopulate: {
    title: true,
    slug: true,
  },
  versions: {
    drafts: {
      autosave: {
        interval: 100,
      },
    },
    maxPerDoc: 50,
  },
  access: {
    read: access({ roles: { editor: true }, type: 'published' }),
    create: access({ roles: { editor: true } }),
    update: access({ roles: { editor: true } }),
    delete: access({ roles: { editor: true } }),
    readVersions: access({ roles: { editor: true } }),
  },
  fields: [
    slug(),
    {
      name: 'pathname',
      type: 'text',
      unique: true,
      index: true,
      label: {
        en: en.common.pathname.singular,
        ru: ru.common.pathname.singular,
      },
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
      hooks: {
        beforeChange: [syncPathname],
      },
    },
    createParentField('page', {
      label: { en: en.common.parentPage.singular, ru: ru.common.parentPage.singular },
    }),
    {
      type: 'tabs',
      tabs: [
        {
          label: {
            en: 'Main',
            ru: 'Основное',
          },
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
              label: {
                en: en.common.title.singular,
                ru: ru.common.title.singular,
              },
            },
            {
              name: 'content',
              type: 'richText',
              label: {
                en: en.common.content,
                ru: ru.common.content,
              },
              editor: lexicalEditor({
                features({ rootFeatures }) {
                  return [
                    ...rootFeatures,
                    BlocksFeature({
                      blocks: [Banner],
                    }),
                  ]
                },
              }),
            },
          ],
        },
        {
          name: 'meta',
          label: 'SEO',
          fields: [
            OverviewField({
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
              imagePath: 'meta.image',
            }),
            MetaTitleField({
              hasGenerateFn: true,
              overrides: {
                label: {
                  en: en.common.title.singular,
                  ru: ru.common.title.singular,
                },
              },
            }),
            MetaDescriptionField({}),
            MetaImageField({ relationTo: 'media' }),
            PreviewField({
              hasGenerateFn: true,
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
            }),
          ],
        },
      ],
    },
    createBreadcrumbsField('page', { admin: { hidden: true } }),
  ],
}
