import type { Session, User } from '@prisma/client'
import type { Request } from 'express'

import type { TokenPayload } from '@/utils/auth/tokens'

declare global {
  export type UserOmitPass = Omit<User, 'password'>
  export type Auth = { user: UserOmitPass; session: Session }
  namespace Express {
    interface Request {
      auth: Auth
    }
  }
}
