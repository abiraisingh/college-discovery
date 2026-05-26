import { PrismaClient } from '@prisma/client';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error(
    'DATABASE_URL is not set. Please add DATABASE_URL to your .env file or environment variables.'
  );
}

let prismaUrl: URL;
try {
  prismaUrl = new URL(databaseUrl);
} catch (cause) {
  throw new Error(
    `DATABASE_URL is invalid: ${cause instanceof Error ? cause.message : String(cause)}`
  );
}

if (prismaUrl.hostname === 'localhost' || prismaUrl.hostname === '127.0.0.1') {
  throw new Error(
    'DATABASE_URL is currently pointing at localhost. Restart the Next.js server after updating .env and make sure no local DATABASE_URL environment variable is overriding the Supabase connection string.'
  );
}

if (databaseUrl.includes('[YOUR-PASSWORD]') || databaseUrl.includes('YOUR-PASSWORD')) {
  throw new Error(
    'DATABASE_URL contains a placeholder password. Replace [YOUR-PASSWORD] with your actual database password in .env.'
  );
}

const globalForPrisma = global as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
