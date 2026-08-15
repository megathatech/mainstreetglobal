import { PrismaClient } from '@prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Initialize Prisma with Neon adapter (Prisma 7 way)
let prisma: PrismaClient

if (typeof window === 'undefined') {
  const connectionString = process.env.DATABASE_URL
  
  if (connectionString) {
    // Create Neon adapter with connection string
    const adapter = new PrismaNeon({
      connectionString: connectionString
    })
    
    prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter })
    
    if (process.env.NODE_ENV !== 'production') {
      globalForPrisma.prisma = prisma
    }
  } else {
    // Fallback if no DATABASE_URL (shouldn't happen)
    prisma = globalForPrisma.prisma ?? new PrismaClient()
  }
} else {
  prisma = new PrismaClient()
}

export { prisma }
