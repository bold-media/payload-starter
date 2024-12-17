import jwt from 'jsonwebtoken'
import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'
import { CollectionSlug } from 'payload'

const payloadToken = 'payload-token'

export const GET = async (
  req: Request & {
    cookies: {
      get: (name: string) => {
        value: string
      }
    }
  },
): Promise<Response> => {
  const payload = await getPayload({ config })
  const token = req.cookies.get(payloadToken)?.value
  const { searchParams } = new URL(req.url)
  const pathname = searchParams.get('pathname')
  const collection = searchParams.get('collection') as CollectionSlug

  const previewSecret = searchParams.get('previewSecret')

  console.log(`payloadToken: ${token}`)

  if (previewSecret) {
    return new Response('You are not allowed to view this page', { status: 403 })
  } else {
    if (!pathname) {
      return new Response('No pathname provided', { status: 400 })
    }

    if (!collection) {
      return new Response('No collection provided', { status: 400 })
    }

    if (!token) {
      new Response('You are not allowed to view this preview page', { status: 403 })
    }

    if (!pathname.startsWith('/')) {
      new Response('This endpoint can only be used to preview internal paths.', { status: 400 })
    }

    let user

    try {
      user = jwt.verify(token, payload.secret)
    } catch (error) {
      payload.logger.error('Error verifying token for live preview:', error)
    }

    const draft = await draftMode()

    // You can add additional checks here to see if the user is allowed to preview this page
    if (!user) {
      draft.disable()
      return new Response('You are not allowed to preview this page', { status: 403 })
    }

    // Verify the given slug exists
    try {
      const { docs } = await payload.find({
        collection,
        draft: true,
        limit: 1,
        pagination: false,
        depth: 0,
        select: {},
        where: {
          pathname: {
            equals: pathname,
          },
        },
      })

      if (!docs.length) {
        return new Response('Document not found', { status: 404 })
      }
    } catch (error) {
      payload.logger.error(`Error verifying token for live preview:`, error)
    }

    draft.enable()

    redirect(pathname)
  }
}
