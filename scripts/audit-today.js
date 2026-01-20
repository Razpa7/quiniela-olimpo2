
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const results = await prisma.resultadoHistorico.findMany({
        where: { fecha: hoy },
        orderBy: { sorteo: 'asc' }
    });

    console.log('--- RESULTADOS DE HOY ---');
    results.forEach(r => {
        console.log(`${r.fecha.toISOString().split('T')[0]} | ${r.sorteo.padEnd(12)} | ${r.tipoQuiniela.padEnd(10)} | ${r.primerPremio}`);
    });
}

check().finally(() => prisma.$disconnect());
