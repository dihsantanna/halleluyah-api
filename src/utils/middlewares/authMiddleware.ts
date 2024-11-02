import type { NextFunction, Request, Response } from 'express'

import { prisma } from '@/config/db'
import { verifyToken } from '@/utils/auth/tokens'
import { AppError } from '@/utils/errors/AppError'

export const authMiddleware = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const accessToken = req.headers.authorization

  if (!accessToken) {
    throw new AppError('Token não fornecido', 401)
  }

  const [type, token] = accessToken.split(' ')

  if (type !== 'Bearer') {
    throw new AppError('Token inválido', 401)
  }

  const payload = verifyToken(token)

  if (!payload) {
    throw new AppError('Token inválido', 401)
  }

  const session = await prisma.session.findUnique({
    where: { id: payload.sessionId },
    include: { user: true },
  })

  if (!session) {
    throw new AppError('Sessão Inválida ou Expirou', 401)
  }

  const {
    user: { password, ...user },
    ...rest
  } = session

  req.auth = {
    session: rest,
    user,
  }

  next()
}

export const adminMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  if (req.auth.user.role !== 'leader') {
    throw new AppError('Acesso não autorizado', 403)
  }
  next()
}
