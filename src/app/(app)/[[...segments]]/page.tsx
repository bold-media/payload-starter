import { resolvePathname } from '@/utils/resolvePathname'
import { draftMode } from 'next/headers'
import { getPayload, Where } from 'payload'
import React, { cache } from 'react'
import config from '@payload-config'
import { notFound } from 'next/navigation'
import { RichText } from '@/modules/common/RichText'
import { Metadata, ResolvingMetadata } from 'next'

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
    const { isEnabled: draft } = await draftMode()
    const payload = await getPayload({ config })

    const query: Where = draft
      ? { pathname: { equals: pathname } }
      : {
          and: [{ _status: { equals: 'published' } }, { pathname: { equals: pathname } }],
        }

    const data = await payload.find({
      collection: 'page',
      draft,
      where: query,
    })
    return data.docs?.[0] ?? null
  } catch (error) {
    return null
  }
})


export const generateMetadata = async ({params}: Props, parentPromise: ResolvingMetadata): Promise<Metadata> => {
  const { segments } = await params;
  const pathname = resolvePathname(segments)
  const page = await queryPageByPathname(pathname);
  const parent = await parentPromise;

  const ogImage = typeof page?.meta?.image === 'object' && page?.meta?.image !== null && 'url' in page?.meta?.image && `${page.meta.image.url}`;

  return {
    title: page?.meta?.title || parent.title,
    description: page?.meta?.description || parent?.description,
    openGraph: {
      title: page?.meta?.title || parent.title || '',
      description: page?.meta?.description || parent?.description || '',
      url: `${process.env.NEXT_PUBLIC_APP_URL}${page?.pathname}`,
      images: typeof ogImage === 'string' ? ogImage : undefined
    }
  }
}