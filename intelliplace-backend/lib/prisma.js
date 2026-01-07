import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
});

// Test database connection on startup (async, don't block)
(async () => {
  try {
    await prisma.$connect();
    console.log('✅ Database connected successfully');
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    if (error.code === 'P1001') {
      console.error('\n⚠️  Database Connection Troubleshooting:');
      console.error('1. Check if Neon database is paused - visit Neon Console to wake it up');
      console.error('2. Verify DATABASE_URL in .env file is correct');
      console.error('3. Ensure DATABASE_URL includes ?sslmode=require for Neon');
      console.error('4. Check network connectivity');
      console.error('5. Verify database credentials are valid\n');
    }
  }
})();

// Handle graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

export default prisma;

