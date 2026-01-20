const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function count() {
    try {
        const count = await prisma.resultadoHistorico.count();
        console.log('Total results in DB:', count);
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

count();
