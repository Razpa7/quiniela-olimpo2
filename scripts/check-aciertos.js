const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkSchemaAciertos() {
    try {
        const columns = await prisma.$queryRaw`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'aciertos';
    `;
        console.log('Columns in "aciertos":', columns);
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

checkSchemaAciertos();
