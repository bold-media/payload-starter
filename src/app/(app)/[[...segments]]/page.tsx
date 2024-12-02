import { resolvePathname } from '@/utils/resolvePathname'
import { draftMode } from 'next/headers'
import { getPayload, Where } from 'payload'
import React, { cache } from 'react'
import config from '@payload-config'
import { notFound } from 'next/navigation'
import { RichText } from '@/modules/common/RichText'

interface PagesProps {
  params: Promise<{
    segments: string[]
  }>
}

const Pages = async ({ params }: PagesProps) => {
  const { segments } = await params
  const pathname = resolvePathname(segments)
  const page = await queryPageByPathname(pathname)

  if (!page || !page?.content) {
    notFound()
  }

  const payload = await getPayload({ config })
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
