export const getPathSegments = (pathname: string) => {
    const segments = pathname.replace(/^\/|\/$/g, '').split('/')
  
    if (getPathSegments.length === 1 && segments[0] === '') {
      return undefined
    }
    return segments
  }
  