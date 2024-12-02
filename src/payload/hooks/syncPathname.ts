import { FieldHook } from 'payload'

export const syncPathname: FieldHook = async ({ req, data, value, operation }) => {
  if (
    (operation === 'create' || operation === 'update') &&
    data?.breadcrumbs?.at(-1)?.url !== value &&
    data?.breadcrumbs?.at(-1)?.url !== '/undefined'
  ) {
    return data?.breadcrumbs?.at(-1)?.url || ''
  }
}
