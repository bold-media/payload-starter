import { access as baseAccess } from '@/payload/access'
import { User } from '@payload-types'
import { AccessArgs, PayloadRequest, Where } from 'payload'

type TestRole = User['roles'][number] | 'viewer' | 'contributor' | 'reviewer' | 'role1' | 'role2'

// Create a test-specific User type
type TestUser = Omit<User, 'roles'> & {
  roles: TestRole[]
}

type MockUser = TestUser & {
  collection: 'user'
}

// Cast the access function to work with our test roles
const access = baseAccess as unknown as typeof baseAccess extends (
  config?: { roles?: Partial<Record<User['roles'][number], any>> } & any,
) => any
  ? (config?: { roles?: Partial<Record<TestRole, any>> } & any) => any
  : never

const createMockUser = (roles: TestUser['roles'], id = '123'): MockUser => ({
  id,
  roles,
  collection: 'user',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  email: 'test@example.com',
})

// Changed return type to match AccessArgs
const createMockReq = (user?: Partial<TestUser>): AccessArgs<'user'> => ({
  req: {
    user: user ? createMockUser(user.roles || [], user.id) : null,
  } as PayloadRequest,
})

describe('access', () => {
  describe('public access', () => {
    it('should return true for public type, regardless of user', () => {
      const publicAccess = access({ type: 'public' })

      // Should work without user
      expect(publicAccess(createMockReq())).toBe(true)

      // Should work with any user
      expect(publicAccess(createMockReq({ roles: ['editor'] }))).toBe(true)
    })
  })

  describe('admin access', () => {
    it('should grant access to admin by default', () => {
      const adminAccess = access()
      expect(adminAccess(createMockReq({ roles: ['admin'] }))).toBe(true)
    })

    it('should respect adminLock', () => {
      const lockedAccess = access({ adminLock: true })
      expect(lockedAccess(createMockReq({ roles: ['admin'] }))).toBe(false)
    })

    it('should grant admin access even with other configurations', () => {
      const complexAccess = access({
        roles: {
          editor: false,
        },
        query: { _status: { equals: 'published' } },
      })

      expect(complexAccess(createMockReq({ roles: ['admin'] }))).toBe(true)

      const complexAccess2 = access({
        roles: {
          editor: {
            status: {
              equals: 'draft',
            },
          },
        },
        query: { owner: { equals: 'asdf' } },
      })

      expect(complexAccess2(createMockReq({ roles: ['admin'] }))).toBe(true)
    })
  })

  describe('published type', () => {
    const publishedQuery: Where = { _status: { equals: 'published' } }

    it('should return published query for non-authenticated users', () => {
      const publishedAccess = access({ type: 'published' })
      expect(publishedAccess(createMockReq())).toEqual(publishedQuery)
    })

    it('should return published query for authenticated users without matching roles', () => {
      const publishedAccess = access({ type: 'published' })
      expect(publishedAccess(createMockReq({ roles: ['editor'] }))).toEqual(publishedQuery)
    })

    it('should respect role-specific access for published type', () => {
      const publishedAccess = access({
        type: 'published',
        roles: {
          editor: true,
        },
      })

      expect(publishedAccess(createMockReq({ roles: ['editor'] }))).toBe(true)
    })

    it('should use query for specific roles in published type', () => {
      const customQuery: Where = { author: { equals: '123' } }

      const publishedAccess = access({
        type: 'published',
        roles: {
          editor: customQuery,
        },
      })
      expect(publishedAccess(createMockReq({ roles: ['editor'] }))).toEqual(customQuery)
    })
  })

  describe('role-based access', () => {
    it('should return false for non-authenticated users', () => {
      const roleAccess = access({
        roles: {
          editor: true,
        },
      })
      expect(roleAccess(createMockReq())).toBe(false)
    })

    it('should handle boolean role access', () => {
      const roleAccess = access({
        roles: {
          editor: true,
          viewer: false,
        },
      })

      expect(roleAccess(createMockReq({ roles: ['editor'] }))).toBe(true)
      expect(roleAccess(createMockReq({ roles: ['viewer'] }))).toBe(false)
    })

    it('should handle query-based role access', () => {
      const query: Where = { createBy: { equals: '123' } }
      const roleAccess = access({
        roles: {
          editor: query,
        },
      })

      expect(roleAccess(createMockReq({ roles: ['editor'] }))).toEqual(query)
    })

    it('should combine multiple queries with OR', () => {
      const query1: Where = { field1: { equals: 'value1' } }
      const query2: Where = { field2: { equals: 'value2' } }

      const roleAccess = access({
        roles: {
          role1: query1,
          role2: query2,
        },
      })

      expect(roleAccess(createMockReq({ roles: ['role1', 'role2'] }))).toEqual({
        or: [query1, query2],
      })
    })

    it('should prioritize boolean true over queries in multiple roles', () => {
      const query: Where = { field: { equals: 'value' } }
      const roleAccess = access({
        roles: {
          role1: true,
          role2: query,
        },
      })

      expect(roleAccess(createMockReq({ roles: ['role1', 'role2'] }))).toBe(true)
    })

    it('should handle roles without configurations', () => {
      const roleAccess = access({
        roles: {
          editor: true,
        },
      })
      expect(roleAccess(createMockReq({ roles: ['viewer'] }))).toBe(false)
    })
  })

  describe('default query', () => {
    it('should use default query when no role matches', () => {
      const defaultQuery: Where = { status: { equals: 'active' } }
      const queryAccess = access({
        roles: {
          editor: true,
          reviewer: {
            something: {
              equals: 'something',
            },
          },
        },
        query: defaultQuery,
      })

      expect(queryAccess(createMockReq({ roles: ['viewer'] }))).toEqual(defaultQuery)
    })

    it('should prioritize role-specific access over default query', () => {
      const defaultQuery: Where = { status: { equals: 'active' } }
      const roleQuery: Where = { department: { equals: 'sales' } }

      const queryAccess = access({
        roles: {
          editor: roleQuery,
        },
        query: defaultQuery,
      })

      expect(queryAccess(createMockReq({ roles: ['editor'] }))).toEqual(roleQuery)
      expect(queryAccess(createMockReq({ roles: ['viewer'] }))).toEqual(defaultQuery)
    })
  })

  describe('edge cases', () => {
    it('should handle users with no roles', () => {
      const access1 = access()
      expect(access1(createMockReq({ roles: [] }))).toBe(false)
    })

    it('should handle undefined role configurations', () => {
      const roleAccess = access({
        roles: {
          editor: undefined,
        },
      })
      expect(roleAccess(createMockReq({ roles: ['editor'] }))).toBe(false)
    })

    it('should handle empty configuration', () => {
      const emptyAccess = access({})
      expect(emptyAccess(createMockReq({ roles: ['editor'] }))).toBe(false)
    })

    it('should handle multiple roles with mixed configurations', () => {
      const query: Where = { status: { equals: 'draft' } }
      const mixedAccess = access({
        roles: {
          editor: true,
          reviewer: query,
          viewer: false,
        },
      })

      expect(mixedAccess(createMockReq({ roles: ['editor', 'viewer'] }))).toBe(true)
      expect(mixedAccess(createMockReq({ roles: ['reviewer', 'viewer'] }))).toEqual(query)
    })

    it('should handle all configuration options together', () => {
      const defaultQuery: Where = { status: { equals: 'active' } }
      const roleQuery: Where = { department: { equals: 'sales' } }

      const complexAccess = access({
        type: 'restricted',
        roles: {
          editor: true,
          contributor: roleQuery,
        },
        query: defaultQuery,
        adminLock: true,
      })

      expect(complexAccess(createMockReq({ roles: ['admin'] }))).toEqual(defaultQuery) // adminLock
      expect(complexAccess(createMockReq({ roles: ['editor'] }))).toBe(true)
      expect(complexAccess(createMockReq({ roles: ['contributor'] }))).toEqual(roleQuery)
      expect(complexAccess(createMockReq({ roles: ['viewer'] }))).toEqual(defaultQuery)
      expect(complexAccess(createMockReq())).toBe(false)
    })
  })
})
