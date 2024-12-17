import { getServerSideURL } from './getURL'

type Args = {
  collection: 'page' | 'post'
  pathname: string
}

export const generatePreviewPath = ({ collection, pathname }: Args) => {
  const params = {
    collection,
    pathname,
  }

  const encodedParams = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    encodedParams.append(key, value)
  })

  return `${getServerSideURL()}/next/preview?${encodedParams.toString()}`
}
