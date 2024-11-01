import { prisma } from '@/config/db'
import { AuthController } from '@/modules/auth/auth.controller'
import { AuthService } from '@/modules/auth/auth.service'

export const authService = new AuthService(prisma)
export const authController = new AuthController(authService)
