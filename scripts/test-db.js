const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function test() {
    try {
        console.log('Testing connection...');
        const result = await prisma.resultadoHistorico.findMany({ take: 1 });
        console.log('Connection successful, result:', result);
    } catch (e) {
        console.error('FULL ERROR:', e);
    } finally {
        await prisma.$disconnect();
    }
}

test();
