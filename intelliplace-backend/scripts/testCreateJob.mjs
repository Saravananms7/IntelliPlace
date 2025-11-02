import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Creating test company and job...')
  const company = await prisma.company.create({
    data: {
      companyName: `TestCo ${Date.now()}`,
      email: `testco+${Date.now()}@example.com`,
      password: 'test-password'
    }
  })

  const job = await prisma.job.create({
    data: {
      title: 'Test Job Title',
      description: 'Test job created by migration verification script',
      type: 'FULL_TIME',
      companyId: company.id,
      requiredSkills: 'javascript,nodejs,sql',
      minCgpa: 6.5,
      allowBacklog: true
    }
  })

  console.log('Created job:', job)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
