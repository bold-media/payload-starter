import { draftMode } from 'next/headers'

export const GET = async (): Promise<Response> => {
  const draft = await draftMode()
  draft.disable()
  return new Response('Draft mode is disabled')
}
