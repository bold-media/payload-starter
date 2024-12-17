import { getPayload } from 'payload'
import config from '@payload-config'
import { draftMode } from 'next/headers'
import { cache } from '@/utils/cache'

export const getSettings = cache(
  async () => {
    const payload = await getPayload({ config })
    const settings = await payload
      .findGlobal({ slug: 'settings' })
      .then((res) => res)
      .catch(() => null)
    return settings
  },
  { tags: [`settings`] },
)

// Helper function to get page data without caching
const getPageData = async (pathname: string, draft: boolean) => {
  const payload = await getPayload({ config })

  const { docs } = await payload.find({
    collection: 'page',
    draft,
    limit: 1,
    pagination: false,
    overrideAccess: draft,
    disableErrors: true,
    where: {
      pathname: {
        equals: pathname,
      },
    },
  })
  return docs?.[0] || null
}

const getCachedPageData = cache(
  async (pathname: string) => {
    console.log(`Cache Miss at: ${pathname}`)
    return getPageData(pathname, false)
  },
  { tags: (pathname) => [pathname] },
)

export const getPageByPathname = async (pathname: string) => {
  try {
    const { isEnabled: draft } = await draftMode()

    if (draft) {
      return getPageData(pathname, true)
    }

    return getCachedPageData(pathname)
  } catch (error) {
    console.error('Error fetching page:', error)
    return null
  }
}
