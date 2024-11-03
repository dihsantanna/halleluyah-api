import { hashidTransformer } from '@/config/di'
import type { Role } from '@prisma/client'

export class RegisterResource {
  readonly id: string
  readonly name: string | null
  readonly email: string
  readonly role: Role
  readonly image: string | null
  readonly createdAt: Date
  readonly updatedAt: Date | null
  readonly deletedAt: Date | null
  constructor(user: UserOmitPass) {
    const encodedUser = hashidTransformer.deepEncode<RegisterResource>(user, [
      'id',
    ])

    this.id = encodedUser.id
    this.name = user.name
    this.email = user.email
    this.role = user.role
    this.image = user.image
    this.createdAt = user.createdAt
    this.updatedAt = user.updatedAt
    this.deletedAt = user.deletedAt
  }
}
