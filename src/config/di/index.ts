import { prisma } from '@/config/db'
import { AuthController } from '@/modules/auth/auth.controller'
import { AuthService } from '@/modules/auth/auth.service'
import { HashidTransformer } from '../hashid'

export const hashidTransformer = new HashidTransformer()
export const authService = new AuthService(prisma, hashidTransformer)
export const authController = new AuthController(authService)
