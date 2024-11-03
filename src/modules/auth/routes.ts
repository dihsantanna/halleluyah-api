import type { AuthController } from '@/modules/auth/auth.controller'
import {
  adminMiddleware,
  authMiddleware,
} from '@/utils/middlewares/authMiddleware'
import { Router } from 'express'

export const authRoutes = (authController: AuthController) => {
  const router = Router()

  // Rotas Públicas
  router.post('/login', authController.login)
  router.post('/refresh', authController.refresh)

  // Rotas Privadas
  router.use(authMiddleware)

  router.get('/me', authController.me)
  router.post('/logout', authController.logout)
  router.post('/logout-all', authController.logoutAll)

  // Rotas Admin
  const adminRouter = Router()
  adminRouter.use(adminMiddleware)
  adminRouter.post('/register', (req, res) => authController.register(req, res))

  router.use('/admin', adminRouter)

  return router
}
