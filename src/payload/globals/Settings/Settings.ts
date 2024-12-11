import { revalidateGlobal } from '@/payload/hooks/revalidateGlobal'
import { MetaDescriptionField, MetaTitleField } from '@payloadcms/plugin-seo/fields'
import { GlobalConfig } from 'payload'

export const Settings: GlobalConfig = {
  slug: 'settings',
  label: {
    en: 'Settings',
    ru: 'Настройки',
  },
  admin: {
    group: {
      en: 'Admin',
      ru: 'Админ',
    },
  },
  hooks: {
    afterChange: [revalidateGlobal]
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          name: 'company',
          fields: [
            {
              type: 'text',
              name: 'name',
            },
          ],
        },
        {
          name: 'navigation',
          label: {
            en: 'Navigation',
            ru: 'Навигация',
          },
          fields: [],
        },
        {
          name: 'seo',
          label: 'SEO',
          description: {
            en: `These settings serve as a fallback for any pages that do not have SEO configured. If a page has SEO configured, these settings will be ignored.`,
            ru: `Эти настройки используются как запасные для страниц, у которых не настроен SEO. Если у страницы настроен SEO, эти настройки будут проигнорированы.`,
          },
          fields: [
            MetaTitleField({
              hasGenerateFn: false,
            }),
            MetaDescriptionField({
              hasGenerateFn: false,
            }),
          ],
        },
      ],
    },
  ],
}
