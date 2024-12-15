import { cache as reactCache } from 'react'
import { unstable_cache as nextCache } from 'next/cache'

type CacheOptions = {
  revalidate?: number | false
  tags?: string[] | ((...args: any[]) => string[])
}

/**
 * Combines React's cache (for deduping requests) with Next.js unstable_cache (for persistent caching).
 * Allows dynamic tags based on function arguments for targeted revalidation.
 * @see https://nextjs.org/docs/app/api-reference/functions/unstable_cache#parameters
 * @param fn - The async function to cache
 * @param options - Cache configuration (revalidate duration and tags)
 * @param closureVars - Only needed if fn uses external variables not passed as args
 */
export const cache = <TArgs extends any[], TResult>(
  fn: (...args: TArgs) => Promise<TResult>,
  options?: CacheOptions,
  closureVars?: string[],
) =>
  reactCache((...args: TArgs) =>
    nextCache(fn, closureVars, {
      revalidate: options?.revalidate,
      tags: typeof options?.tags === 'function' ? options.tags(...args) : options?.tags,
    })(...args),
  )
