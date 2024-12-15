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

export const getPageByPathname = cache(
  async (pathname: string) => {
    try {
      console.log(`queryPageByPathname: ${pathname}`)
      const { isEnabled: draft } = await draftMode()
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
    } catch (error) {
      return null
    }
  },
  { tags: (pathname) => [pathname] },
)
