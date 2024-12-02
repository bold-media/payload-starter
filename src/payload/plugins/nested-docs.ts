import { nestedDocsPlugin } from '@payloadcms/plugin-nested-docs'

export const nestedDocs = nestedDocsPlugin({
  collections: [],
  generateLabel: (_, doc) => doc?.title as string,
  //Do not change the `.replace` below. It ensures that "/" is allowed for the slug, with breadcrumbs
  generateURL: (docs) => docs.reduce((url, doc) => `${url}/${doc.slug}`.replace(/^\/+/, '/'), ''),
})
