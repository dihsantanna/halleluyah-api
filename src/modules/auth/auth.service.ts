import type { PrismaClient, User } from '@prisma/client'
import bcrypt from 'bcrypt'
import moment from 'moment'

import type { HashidTransformer } from '@/config/hashid'
import type { LoginDTO, RegisterDTO } from '@/modules/auth/dto/auth.dto'
import { generateTokens } from '@/utils/auth/tokens'
import { AppError } from '@/utils/errors/AppError'
import { ValidationError } from '@/utils/errors/ValidationError'

export class AuthService {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly hashid: HashidTransformer,
  ) {
    this.me = this.me.bind(this)
    this.register = this.register.bind(this)
    this.login = this.login.bind(this)
    this.refreshToken = this.refreshToken.bind(this)
    this.logout = this.logout.bind(this)
    this.logoutAll = this.logoutAll.bind(this)
  }
  private async generateSession(
    user: User,
    deviceInfo?: string | null,
    keepConnected = false,
  ) {
    const expiresIn = keepConnected
      ? moment().add(90, 'days').toDate()
      : moment().add(7, 'day').toDate()

    const session = await this.prisma.session.create({
      data: {
        userId: user.id,
        refreshToken: 'temporary',
        deviceInfo,
        expiresAt: expiresIn,
        lastActivity: new Date(),
      },
      include: { user: true },
    })

    // Regenera os tokens com o sessionId
    const tokens = generateTokens(
      {
        sub: user.id,
        sessionId: session.id,
        role: user.role,
        email: session.user.email,
      },
      keepConnected,
    )

    // Atualiza o refresh token na sessão
    await this.prisma.session.update({
      where: { id: session.id },
      data: { refreshToken: tokens.refreshToken },
    })

    return {
      ...tokens,
      sessionId: session.id,
    }
  }

  async register(data: RegisterDTO) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: data.email },
    })

    if (existingUser) {
      throw new ValidationError([
        {
          key: 'email',
          message: 'Email ja cadastrado',
        },
      ])
    }

    const hashedPassword = await bcrypt.hash(data.password, 10)

    const { password, ...user } = await this.prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: data.role,
      },
    })

    return user
  }

  async login(data: LoginDTO) {
    const user = await this.prisma.user.findUnique({
      where: { email: data.email },
    })

    if (!user) {
      throw new ValidationError(
        [
          {
            key: 'email',
            message: 'Credenciais inválidas',
          },
          {
            key: 'password',
            message: 'Credenciais inválidas',
          },
        ],
        401,
      )
    }

    const validPassword = await bcrypt.compare(data.password, user.password)

    if (!validPassword) {
      throw new ValidationError(
        [
          {
            key: 'email',
            message: 'Credenciais inválidas',
          },
          {
            key: 'password',
            message: 'Credenciais inválidas',
          },
        ],
        401,
      )
    }

    const tokens = await this.generateSession(
      user,
      data.deviceInfo,
      data.keepConnected,
    )

    return {
      ...tokens,
    }
  }

  async me(userId: number) {
    const { password, ...user } =
      (await this.prisma.user.findUnique({
        where: { id: userId },
      })) ?? {}

    if (!user) {
      throw new AppError('Usuário não encontrado', 404)
    }

    return user as UserOmitPass
  }

  async refreshToken(oldRefreshToken: string) {
    const session = await this.prisma.session.findUnique({
      where: { refreshToken: oldRefreshToken },
      include: { user: true },
    })

    if (!session || moment().isAfter(moment(session.expiresAt))) {
      throw new AppError('Sessão inválida ou expirada', 401)
    }

    const tokens = await this.generateSession(
      session.user,
      session.deviceInfo,
      moment().add(7, 'day').isBefore(moment(session.expiresAt)),
    )

    // Remove a sessão antiga
    await this.prisma.session.delete({
      where: { id: session.id },
    })

    return tokens
  }

  async logout(sessionId: string) {
    await this.prisma.session.delete({
      where: { id: sessionId },
    })
  }

  async logoutAll(userId: number) {
    await this.prisma.session.deleteMany({
      where: { userId },
    })
  }
}
