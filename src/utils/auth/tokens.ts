import jwt from 'jsonwebtoken'

import { env } from '@/config/env'
import { type TokenDTO, tokenSchema } from '@/modules/auth/dtos/auth.dto'

export type TokenPayload = Omit<TokenDTO, 'iat' | 'exp'>

export const generateTokens = (
  payload: TokenPayload,
  keepConnected = false,
) => {
  const accessToken = jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: '1h',
  })

  const refreshToken = jwt.sign(payload, env.JWT_REFRESH_SECRET, {
    expiresIn: keepConnected ? '90d' : '7d',
  })

  return {
    accessToken,
    refreshToken,
  }
}

export const verifyToken = async (
  token: string,
  isRefresh = false,
): Promise<TokenDTO | null> => {
  try {
    const secret = isRefresh ? env.JWT_REFRESH_SECRET : env.JWT_SECRET
    const parsedToken = jwt.verify(token, secret) as unknown as TokenDTO
    return await tokenSchema.parseAsync(parsedToken)
  } catch {
    return null
  }
}
