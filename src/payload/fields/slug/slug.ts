import type { Field, FieldHook } from 'payload'
import format from 'standard-slugify'
import { deepMerge } from '@/utils/deepMerge'
import { en } from '@/payload/i18n/en'
import { ru } from '@/payload/i18n/ru'
import { generateShortId } from '@/utils/generateShortId'

type Slug = (fieldToUse?: string, overrides?: Partial<Field>) => Field

const formatSlug =
  (field: string): FieldHook =>
  ({ operation, value, previousValue, data, context }) => {
    if (
      (operation === 'create' || operation === 'update') &&
      value !== previousValue &&
      !context.duplicate
    ) {
      if (value === '/') {
        return value
      }

      //slug was manually entered, format it.
      if (typeof value === 'string' && value?.length > 0) {
        return format(value)
      }
    }

    if (
      (operation === 'create' || operation === 'update') &&
      !value &&
      data?.[field] &&
      !context.duplicate
    ) {
      return format(data?.[field])
    }
  }

export const slug: Slug = (fieldToUse = 'title', overrides = {}) =>
  deepMerge<Field, Partial<Field>>(
    {
      name: 'slug',
      label: {
        en: en.common.slug.singular,
        ru: ru.common.slug.singular,
      },
      type: 'text',
      index: true,
      unique: true,
      admin: {
        position: 'sidebar',
      },
      hooks: {
        beforeValidate: [formatSlug(fieldToUse)],
        beforeDuplicate: [
          ({ value, context }) => {
            context.duplicate = true
            if (value === '/') {
              return generateShortId()
            }
            return `${value}-${generateShortId()}`
          },
        ],
      },
    },
    overrides,
  )
