export const getPathSegments = (pathname: string) => {
  // Remove leading and trailing slashes, then split them
  const segments = pathname.replace(/^\/|\/$/g, '').split('/')

  // handle empty string case (root path ("/"))
  if (getPathSegments.length === 1 && segments[0] === '') {
    return []
  }
  return segments
}
