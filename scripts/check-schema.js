const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkSchema() {
    try {
        const columns = await prisma.$queryRaw`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'results';
    `;
        console.log('Columns in "results":', columns);
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

checkSchema();
