const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkToday() {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    console.log('Checking results for:', hoy);

    const results = await prisma.resultadoHistorico.findMany({
        where: { fecha: hoy }
    });

    console.log('Today results:', results);
    await prisma.$disconnect();
}

checkToday();
