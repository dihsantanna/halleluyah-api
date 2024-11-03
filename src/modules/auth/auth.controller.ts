import type { Request, Response } from 'express'

import type { AuthService } from '@/modules/auth/auth.service'
import { loginSchema, registerSchema } from '@/modules/auth/dto/auth.dto'
import { LoginResource } from '@/modules/auth/resource/login.resource'
import { RegisterResource } from '@/modules/auth/resource/register.resource'
import { UserResource } from '@/modules/auth/resource/user.resource'

export class AuthController {
  constructor(private readonly authService: AuthService) {
    this.register = this.register.bind(this)
    this.login = this.login.bind(this)
    this.me = this.me.bind(this)
    this.refresh = this.refresh.bind(this)
    this.logout = this.logout.bind(this)
    this.logoutAll = this.logoutAll.bind(this)
  }

  async register(req: Request, res: Response) {
    const data = registerSchema.parse(req.body)
    const user = await this.authService.register(data)

    res.status(201).json(new RegisterResource(user))

    return
  }

  async login(req: Request, res: Response) {
    const data = loginSchema.parse(req.body)
    const result = await this.authService.login(data)

    res.json(new LoginResource(result))

    return
  }

  async me(req: Request, res: Response) {
    const user = await this.authService.me(req.auth.user.id)
    res.json(new UserResource(user))
    return
  }

  async refresh(req: Request, res: Response) {
    const { refresh_token } = req.body

    if (!refresh_token) {
      res.status(400).json({ message: 'Refresh token é obrigatório' })
      return
    }

    const tokens = await this.authService.refreshToken(refresh_token)

    res.json(new LoginResource(tokens))

    return
  }

  async logout(req: Request, res: Response) {
    const sessionId = req.auth.session.id
    await this.authService.logout(sessionId)

    res.status(204).send()
    return
  }

  async logoutAll(req: Request, res: Response) {
    const auth = req.auth

    await this.authService.logoutAll(auth.user.id)

    res.status(204).send()
    return
  }
}
