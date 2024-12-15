import { resolvePathname } from '@/utils/resolvePathname'
import { getPayload } from 'payload'
import React from 'react'
import config from '@payload-config'
import { notFound } from 'next/navigation'
import { RichText } from '@/modules/common/RichText'
import { Metadata, ResolvingMetadata } from 'next'
import { generateMeta } from '@/utils/generateMeta'
import { getPathSegments } from '@/utils/getPathSegments'
import { getPageByPathname } from '@/modules/common/data'

interface Props {
  params: Promise<{
    segments: string[]
  }>
}

const Pages = async ({ params }: Props) => {
  const { segments } = await params
  const pathname = resolvePathname(segments)
  const page = await getPageByPathname(pathname)

  if (!page || !page?.content) {
    notFound()
  }

  return (
    <div>
      <RichText content={page?.content} />
    </div>
  )
}

export default Pages

export const generateStaticParams = async () => {
  try {
    const payload = await getPayload({ config })
    const pages = await payload.find({
      collection: 'page',
      draft: false,
      limit: 0,
      overrideAccess: false,
      select: {
        pathname: true,
      },
    })

    const paths = pages?.docs
      ?.filter(
        (page): page is typeof page & { pathname: string } => typeof page?.pathname === 'string',
      )
      .map((page) => ({
        segments: getPathSegments(page.pathname),
      }))

    return paths || []
  } catch (error) {
    return []
  }
}

export const generateMetadata = async (
  { params }: Props,
  parentPromise: ResolvingMetadata,
): Promise<Metadata> => {
  const { segments } = await params
  const pathname = resolvePathname(segments)
  const page = await getPageByPathname(pathname)

  const fallback = await parentPromise

  return generateMeta({ meta: page?.meta, fallback, pathname })
}
