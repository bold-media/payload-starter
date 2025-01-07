import crypto from 'crypto'

export const generateShortId = () => {
  return crypto.randomBytes(6).toString('base64url').slice(0, 8)
}
