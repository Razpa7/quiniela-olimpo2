const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function listAll() {
    try {
        const tables = await prisma.$queryRaw`
      SELECT table_name, column_name, data_type
      FROM information_schema.columns
      WHERE table_schema = 'public'
      ORDER BY table_name, ordinal_position;
    `;
        console.log(JSON.stringify(tables, null, 2));
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

listAll();
