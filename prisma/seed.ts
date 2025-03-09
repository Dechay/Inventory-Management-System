import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  // Create initial categories
  const categories = [
    { name: 'Laptop' },
    { name: 'Switch' },
    { name: 'Router' }
  ]

  for (const category of categories) {
    await prisma.category.upsert({
      where: { name: category.name },
      update: {},
      create: { name: category.name },
    })
  }

  console.log('Seed data created successfully');
}

main()
  .catch((e) => {
    console.error('Error seeding data:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }) 