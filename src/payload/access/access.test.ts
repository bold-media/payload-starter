import { access } from '@/payload/access'
import { User } from '@payload-types'
import { AccessArgs, PayloadRequest } from 'payload'

type MockUser = User & {
  collection: 'user'
}

const createMockUser = (roles: User['roles'], id = '123'): MockUser => ({
  id,
  roles,
  collection: 'user',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  email: 'test@example.com',
})

// Changed return type to match AccessArgs
const createMockReq = (user?: Partial<User>): AccessArgs<'user'> => ({
  req: {
    user: user ? createMockUser(user.roles || [], user.id) : null,
  } as PayloadRequest,
})

describe('access', () => {
  describe('public access', () => {
    it('should return true for public type, regardless of user', () => {
      const publicAccess = access({ type: 'public' })

      expect(publicAccess(createMockReq())).toBe(true)
    })
  })
})
