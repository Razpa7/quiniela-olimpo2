const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function findValue() {
    const results = await prisma.resultadoHistorico.findMany({
        where: {
            OR: [
                { primerPremio: '9348' },
                { primerPremio: '9580' }
            ]
        },
        orderBy: { fecha: 'desc' }
    });

    console.log('--- FOUND RESULTS ---');
    results.forEach(r => {
        console.log(`${r.fecha.toISOString().split('T')[0]} | ${r.sorteo} | ${r.tipoQuiniela} | ${r.primerPremio}`);
    });
}

findValue().finally(() => prisma.$disconnect());
