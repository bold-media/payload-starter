import { AccessResult, AccessArgs as PayloadAccessArgs, Where } from 'payload'
import { User } from '@payload-types'

type AccessType = 'public' | 'restricted' | 'published'

// Function that generates a Where query using access args
type DynamicQuery = (args: PayloadAccessArgs<'user'>) => Where

// RoleConfig can now be a static Where, boolean, or dynamic query function
type RoleConfig = Where | boolean | DynamicQuery

type AccessConfig = {
  type?: AccessType
  roles?: Partial<Record<User['roles'][number], RoleConfig>>
  query?: Where | DynamicQuery
  adminLock?: boolean
}

export const access = (config?: AccessConfig) => {
  return (args: PayloadAccessArgs<'user'>): AccessResult => {
    const type = config?.type || 'restricted'
    const publishedQuery = { _status: { equals: 'published' } }

    // handle public access
    if (type === 'public') {
      return true
    }

    const user = args.req.user

    if (!user) {
      return type === 'published' ? publishedQuery : false
    }

    // Admin gets access, unless explicitly removed by adminLock
    if (user.roles.includes('admin') && !config?.adminLock) {
      return true
    }

    let roleQueries: AccessResult[] = []

    // Collect all applicable role-based access results
    if (config?.roles) {
      for (const role of user?.roles) {
        const roleConfig = config.roles[role]
        if (roleConfig !== undefined) {
          // Handle function-based queries
          if (typeof roleConfig === 'function') {
            roleQueries.push(roleConfig(args))
          } else {
            roleQueries.push(roleConfig)
          }
        }
      }
    }

    // If we have role-specific results, find the most permissive one
    if (roleQueries.length > 0) {
      // If any role grants full access (true), return true
      if (roleQueries.some((query) => query === true)) {
        return true
      }

      // If we have Where queries, combine them with OR
      const whereQueries = roleQueries.filter((query): query is Where => typeof query === 'object')
      if (whereQueries.length > 0) {
        return whereQueries.length === 1 ? whereQueries[0] : { or: whereQueries }
      }

      // If we only had false values, return false
      return false
    }

    // Handle default query
    if (config?.query) {
      if (typeof config.query === 'function') {
        return config.query(args)
      }
      return config.query
    }

    // for published type with no other access rules, return published query
    if (type === 'published') {
      return publishedQuery
    }

    //finally, return false if no access is permitted
    return false
  }
}
