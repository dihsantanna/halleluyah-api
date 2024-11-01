import { z } from 'zod'

const passwordSchema = z
  .string()
  .min(8, 'Senha deve ter no mínimo 8 caracteres')
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/,
    'Senha deve conter ao menos uma letra maiúscula, uma minúscula, um número e um caracter especial',
  )

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: passwordSchema,
  keepConnected: z.boolean().optional().default(false),
  deviceInfo: z.string().optional(),
})

export const registerSchema = z.object({
  name: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: passwordSchema,
  role: z
    .enum(['leader', 'member'], {
      message: 'Função inválida',
    })
    .default('member'),
})

export const tokenSchema = z.object({
  sub: z.number({
    message: 'Token inválido',
  }),
  sessionId: z.string({
    message: 'Token inválido',
  }),
  role: z
    .enum(['leader', 'member'], {
      message: 'Token inválido',
    })
    .default('member'),
  email: z
    .string({
      message: 'Token inválido',
    })
    .email('Token inválido'),
  iat: z.number({
    message: 'Token inválido',
  }),
  exp: z.number({
    message: 'Token inválido',
  }),
})

export type LoginDTO = z.infer<typeof loginSchema>
export type RegisterDTO = z.infer<typeof registerSchema>
export type TokenDTO = z.infer<typeof tokenSchema>
