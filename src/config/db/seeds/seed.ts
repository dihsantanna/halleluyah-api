import { prisma } from '@/config/db'

const run = async () => {
  await prisma.user.upsert({
    where: { email: 'admin@admin.com' },
    update: {},
    create: {
      name: 'Admin',
      email: 'admin@admin.com',
      password: '$2b$10$zrvV2zWXSs6ad2rJyWmPWOZcJx5uC/5vj2rmqyFYOeAsDhiqThk.G',
      role: 'leader',
    },
  })
}

run()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
