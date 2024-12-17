import { Page } from '@payload-types'
import { revalidateTag } from 'next/cache'
import { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

export const revalidatePage: CollectionAfterChangeHook<Page> = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate && doc?.pathname) {
    if (doc._status === 'published') {
      payload.logger.info(`Revalidating page at path: ${doc.pathname}`)

      revalidateTag(doc.pathname)
    }

    if (
      previousDoc?._status === 'published' &&
      doc._status !== 'published' &&
      previousDoc?.pathname
    ) {
      revalidateTag(previousDoc.pathname)
    }
  }

  return doc
}

export const revalidatePageDelete: CollectionAfterDeleteHook<Page> = ({
  doc,
  req: { context },
}) => {
  if (!context.disableRevalidate && doc?.pathname) {
    revalidateTag(doc.pathname)
  }

  return doc
}
