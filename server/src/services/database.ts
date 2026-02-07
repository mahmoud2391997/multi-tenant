import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Test database connection
export const testConnection = async () => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return { connected: true };
  } catch (error) {
    console.error('Database connection failed:', error);
    return { connected: false, error };
  }
};

// Graceful shutdown
export const disconnect = async () => {
  await prisma.$disconnect();
};

export default prisma;
