import { PayloadRequest } from 'payload'
import { User } from '@payload-types'

type AccessType = 'public' | 'restricted' | 'published'

type FieldAccessArgs = {
  data?: Partial<any> | undefined
  doc?: any
  id?: number | string
  req: PayloadRequest
  siblingData?: Partial<any> | undefined
}

type FieldCondition = (args: FieldAccessArgs) => boolean | Promise<boolean>

type RoleConfig = boolean | FieldCondition

type AccessFieldConfig = {
  type?: AccessType
  roles?: Partial<Record<User['roles'][number], RoleConfig>>
  condition?: FieldCondition
  adminLock?: boolean
}

export const accessField = (config?: AccessFieldConfig) => {
  return async (args: FieldAccessArgs): Promise<boolean> => {
    const type = config?.type || 'restricted'

    // Handle public access
    if (type === 'public') {
      return true
    }

    const user = args?.req?.user

    // Handle non-authenticated users
    if (!user) {
      // For published type, allow access to the field if the document is published
      if (type === 'published') {
        return args.doc?._status === 'published'
      }
      return false
    }

    // Admin access (unless explicitly locked)
    if (user.roles.includes('admin') && !config?.adminLock) {
      return true
    }

    // Process role-specific rules
    if (config?.roles) {
      const results: Promise<boolean>[] = []

      for (const role of user.roles) {
        const roleConfig = config.roles[role]

        if (roleConfig !== undefined) {
          // If it's a boolean, use it directly
          if (typeof roleConfig === 'boolean') {
            results.push(Promise.resolve(roleConfig))
          }
          // If it's a function, evaluate it
          else if (typeof roleConfig === 'function') {
            results.push(Promise.resolve(roleConfig(args)))
          }
        }
      }

      // If we have any results, return true if any are true
      if (results.length > 0) {
        const resolvedResults = await Promise.all(results)
        return resolvedResults.some((result) => result === true)
      }
    }

    // If no role-specific rules matched but there's a condition, use that
    if (config?.condition) {
      return await config.condition(args)
    }

    // For published type with no other access rules, check document status
    if (type === 'published') {
      return args.doc?._status === 'published'
    }

    // Otherwise return false
    return false
  }
}
