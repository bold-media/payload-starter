import type { CollectionConfig } from 'payload'
import { ensureFirstUserIsAdmin } from './hooks/ensureFirstUserIsAdmin'
import { access, accessField } from '@/payload/access'

export const User: CollectionConfig = {
  slug: 'user',
  labels: {
    singular: {
      en: 'User',
      ru: 'Пользователь',
    },
    plural: {
      en: 'Users',
      ru: 'Пользователи',
    },
  },
  admin: {
    useAsTitle: 'email',
    group: {
      en: 'Admin',
      ru: 'Админ',
    },
  },
  auth: true,
  access: {
    read: access({ query: (args) => ({ id: { equals: args.req?.user?.id } }) }),
  },
  fields: [
    {
      name: 'roles',
      label: {
        en: 'Roles',
        ru: 'Роли',
      },
      type: 'select',
      hasMany: true,
      defaultValue: 'editor',
      required: true,
      hooks: {
        beforeValidate: [ensureFirstUserIsAdmin],
      },
      access: {},
      options: [
        {
          label: {
            en: 'Admin',
            ru: 'Админ',
          },
          value: 'admin',
        },
        {
          label: {
            en: 'Editor',
            ru: 'Редактор',
          },
          value: 'editor',
        },
      ],
    },
  ],
}
