import { PrismaClient, OnsitePurpose, OnsideStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 10);

  const users = [
    {
      id: 'user-test-001',
      name: 'Test User',
      email: 'test@example.com',
    },
    {
      id: 'user-tommy-001',
      name: 'Tommy',
      email: 'tommy@example.com',
    },
    {
      id: 'user-gina-001',
      name: 'Gina',
      email: 'gina@example.com',
    },
  ];

  console.log('📝 Creating users...');
  for (const userData of users) {
    const user = await prisma.user.upsert({
      where: { email: userData.email },
      update: {},
      create: {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        password: hashedPassword,
      },
    });

    console.log(`✅ User "${user.name}" created/updated`);
  }

  const customers = [
    {
      id: 'cust-001',
      name: 'Cody Rhodes',
      phone: '08123456789',
    },
    {
      id: 'cust-002',
      name: 'Tatang Suparna',
      phone: '083812345690',
    },
    {
      id: 'cust-003',
      name: 'Asep',
      phone: '085812345678',
    },
  ];

  for (const custData of customers) {
    const customer = await prisma.customer.upsert({
      where: { id: custData.id },
      update: {},
      create: custData,
    });

    console.log(`✅ Customer "${customer.name}" created`);
  }

  const quotes = [
    {
      id: 'quote-001',
      quoteNo: '001',
      customerId: 'cust-001',
      items: {
        create: [
          { name: 'Bakpau Handle', qty: 2 },
          { name: 'SAYAP Handle', qty: 1 },
        ],
      },
    },
    {
      id: 'quote-002',
      quoteNo: '002',
      customerId: 'cust-002',
      items: {
        create: [
          { name: 'Konner Titan Black', qty: 5 },
          { name: 'Aluminum Frame', qty: 3 },
          { name: 'Glass Panel', qty: 2 },
        ],
      },
    },
    {
      id: 'quote-003',
      quoteNo: '003',
      customerId: 'cust-003',
      items: {
        create: [
          { name: 'Pivot System 70mm', qty: 1 },
          { name: 'Dark Prism Handle', qty: 1 },
        ],
      },
    },
    {
      id: 'quote-004',
      quoteNo: '004',
      customerId: 'cust-001',
      items: {
        create: [
          { name: 'Stainless Steel Handle', qty: 3 },
          { name: 'Rubber Grip', qty: 3 },
          { name: 'Mounting Bracket', qty: 2 },
          { name: 'Fasteners Set', qty: 1 },
        ],
      },
    },
    {
      id: 'quote-005',
      quoteNo: '005',
      customerId: 'cust-002',
      items: {
        create: [
          { name: 'Premium Glass Panel', qty: 4 },
          { name: 'Aluminum Channel', qty: 6 },
          { name: 'Seal Strip', qty: 8 },
          { name: 'Hardware Kit', qty: 2 },
        ],
      },
    },
    {
      id: 'quote-006',
      quoteNo: '006',
      customerId: 'cust-003',
      items: {
        create: [
          { name: 'Carbon Fiber Handle', qty: 2 },
          { name: 'Anti-slip Coating', qty: 2 },
          { name: 'Support Rod', qty: 4 },
          { name: 'Connection Joint', qty: 3 },
          { name: 'Protective Cap', qty: 5 },
        ],
      },
    },
  ];

  for (const quoteData of quotes) {
    const quote = await prisma.quote.upsert({
      where: { id: quoteData.id },
      update: {},
      create: quoteData,
    });

    console.log(`✅ Quote "${quote.quoteNo}" created for customer ${quote.customerId}`);
  }

  const onsiteRequests = [
    {
      id: 'onsite-001',
      requestedById: 'user-tommy-001',
      purpose: OnsitePurpose.PENGIRIMAN_BARANG,
      onsiteAt: new Date('2025-12-25T09:00:00'),
      address: 'Jl. Merdeka No. 123, Jakarta',
      status: OnsideStatus.REQUESTED,
      quoteId: 'quote-001',
      items: {
        create: [
          { name: 'Bakpau Handle', qty: 2 },
          { name: 'SAYAP Handle', qty: 1 },
        ],
      },
    },
    {
      id: 'onsite-002',
      requestedById: 'user-gina-001',
      purpose: OnsitePurpose.MEETING,
      onsiteAt: new Date('2025-12-26T14:00:00'),
      address: 'Jl. Sudirman No. 456, Bandung',
      status: OnsideStatus.APPROVED,
      quoteId: 'quote-002',
      items: {
        create: [
          { name: 'Konner Titan Black', qty: 5 },
          { name: 'Aluminum Frame', qty: 3 },
          { name: 'Glass Panel', qty: 2 },
        ],
      },
    },
    {
      id: 'onsite-003',
      requestedById: 'user-tommy-001',
      purpose: OnsitePurpose.SURVEY,
      onsiteAt: new Date('2025-12-27T10:00:00'),
      address: 'Jl. Ahmad Yani No. 789, Surabaya',
      status: OnsideStatus.REQUESTED,
      quoteId: 'quote-003',
      items: {
        create: [
          { name: 'Pivot System 70mm', qty: 1 },
          { name: 'Dark Prism Handle', qty: 1 },
          { name: 'Support Bracket', qty: 2 },
        ],
      },
    },
  ];

  for (const requestData of onsiteRequests) {
    const request = await prisma.onsiteRequest.upsert({
      where: { id: requestData.id },
      update: {},
      create: requestData,
    });

    console.log(`✅ Onsite request "${request.id}" created (Status: ${request.status})`);
  }

  console.log('\n✨ Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
