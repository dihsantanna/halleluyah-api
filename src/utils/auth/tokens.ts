import jwt from 'jsonwebtoken'

import { hashidTransformer } from '@/config/di'
import { env } from '@/config/env'
import { type TokenDTO, tokenSchema } from '@/modules/auth/dto/auth.dto'

export type TokenPayload = Omit<TokenDTO, 'iat' | 'exp'>

export const generateTokens = (
  payload: TokenPayload,
  keepConnected = false,
) => {
  const hashedPayload = hashidTransformer.deepEncode<TokenPayload>(payload, [
    'sub',
  ])

  const accessToken = jwt.sign(hashedPayload, env.JWT_SECRET, {
    expiresIn: '1h',
  })

  const refreshToken = jwt.sign(hashedPayload, env.JWT_REFRESH_SECRET, {
    expiresIn: keepConnected ? '90d' : '7d',
  })

  return {
    accessToken,
    refreshToken,
  }
}

export const verifyToken = (
  token: string,
  isRefresh = false,
): TokenDTO | null => {
  try {
    const secret = isRefresh ? env.JWT_REFRESH_SECRET : env.JWT_SECRET
    const parsedToken = jwt.verify(token, secret) as unknown as TokenDTO
    return tokenSchema.parse(parsedToken)
  } catch {
    return null
  }
}
