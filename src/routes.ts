import { authController } from '@/config/di'
import { authRoutes } from '@/modules/auth/routes'

export const routes = {
  authRoutes: authRoutes(authController),
}
