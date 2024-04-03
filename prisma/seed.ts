// prisma/seed.ts
import { Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const logger = new Logger('Seed');

async function main() {
  logger.log('Seeding data...');

  await prisma.user.deleteMany({});

  await prisma.user.create({
    data: {
      id: 3,
      name: 'Alice',
      email: 'alice@coform.com',
    },
  });

  logger.log('Data seeded successfully');
}

main()
  .catch((e) => logger.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
