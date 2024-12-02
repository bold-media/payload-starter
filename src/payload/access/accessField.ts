import { AccessArgs } from 'payload'
import { User } from '@payload-types'

type FieldCondition = (args: AccessArgs) => boolean

type RoleConfig = boolean | FieldCondition

type AccessFieldConfig = {
  roles?: Partial<Record<User['roles'][number], RoleConfig>>
  condition?: FieldCondition
  adminLock?: boolean
}
export const accessField = (config?: AccessFieldConfig) => {
  return (args: AccessArgs): boolean => {
    const user = args.req.user

    if (!user) {
      return false
    }

    // Admin access (unless explicitly locked)
    if (user.roles.includes('admin') && !config?.adminLock) {
      return true
    }

    // Process role-specific rules
    if (config?.roles) {
      const results: boolean[] = []

      for (const role of user.roles) {
        const roleConfig = config.roles[role]

        if (roleConfig !== undefined) {
          // If it's a boolean, use it directly
          if (typeof roleConfig === 'boolean') {
            results.push(roleConfig)
          }
          // If it's a function, evaluate it
          else if (typeof roleConfig === 'function') {
            results.push(roleConfig(args))
          }
        }
      }

      // If we have any results, return true if any are true
      if (results.length > 0) {
        return results.some((result) => result === true)
      }
    }

    // If no role-specific rules matched but there's a condition, use that
    if (config?.condition) {
      return config.condition(args)
    }

    // Otherwise return false
    return false
  }
}
