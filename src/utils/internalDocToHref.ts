import { SerializedLinkNode } from '@payloadcms/richtext-lexical'

export const internalDocToHref = ({ linkNode }: { linkNode: SerializedLinkNode }): string => {
  const { value, relationTo } = linkNode.fields.doc!

  if (typeof value !== 'object') {
    throw new Error('Expected value to be an object')
  }

  switch (relationTo) {
    case 'page':
      return `${value?.pathname}`
    case 'post':
      return `/post/${value?.slug}`
    default:
      return '#'
  }
}
