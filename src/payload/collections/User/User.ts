import type { CollectionConfig } from 'payload'
import { ensureFirstUserIsAdmin } from './hooks/ensureFirstUserIsAdmin'
import { accessField } from '@/payload/access'

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
  fields: [
    {
      name: 'roles',
      label: {
        en: 'Roles',
        ru: 'Роли',
      },
      type: 'select',
      hasMany: true,
      defaultValue: 'user',
      required: true,
      hooks: {
        beforeValidate: [ensureFirstUserIsAdmin],
      },
      access: {
        read: accessField({ condition: (args) => args.id === args.req?.user?.id }),
        update: accessField(),
      },
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
