import { resolvePathname } from '@/utils/resolvePathname'
import { draftMode } from 'next/headers'
import { getPayload } from 'payload'
import React, { cache } from 'react'
import config from '@payload-config'
import { notFound } from 'next/navigation'
import { RichText } from '@/modules/common/RichText'
import { Metadata, ResolvingMetadata } from 'next'
import { generateMeta } from '@/utils/generateMeta'
// import { getPathSegments } from '@/utils/getPathSegments'

interface Props {
  params: Promise<{
    segments: string[]
  }>
}

const Pages = async ({ params }: Props) => {
  const { segments } = await params
  const pathname = resolvePathname(segments)
  const page = await queryPageByPathname(pathname)

  if (!page || !page?.content) {
    notFound()
  }

  return (
    <div>
      <RichText content={page.content} />
    </div>
  )
}

export default Pages

const queryPageByPathname = cache(async (pathname: string) => {
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
})

/**
 * for when using PPR
 */
// export const generateStaticParams = async () => {
//   try {
//     const payload = await getPayload({config})
//     const pages = await payload.find({
//       collection: "page",
//       draft: false,
//       limit: 0,
//       overrideAccess: false,
//       select: {
//         pathname: true
//       }
//     })

//     const paths = pages?.docs
//     ?.filter((page): page is typeof page & { pathname: string } =>
//       typeof page?.pathname === 'string'
//     )
//     .map((page) => ({
//       segments: getPathSegments(page.pathname)
//     }))
//   } catch (error) {
//     return []
//   }
// }

export const generateMetadata = async (
  { params }: Props,
  parentPromise: ResolvingMetadata,
): Promise<Metadata> => {
  const { segments } = await params
  const pathname = resolvePathname(segments)
  const page = await queryPageByPathname(pathname)

  const fallback = await parentPromise

  return generateMeta({ meta: page?.meta, fallback, pathname })
}
