
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const nac = await prisma.resultadoHistorico.findMany({
        where: { fecha: hoy, tipoQuiniela: 'Nacional' },
        orderBy: { sorteo: 'asc' }
    });

    const pro = await prisma.resultadoHistorico.findMany({
        where: { fecha: hoy, tipoQuiniela: 'Provincial' },
        orderBy: { sorteo: 'asc' }
    });

    console.log('--- COMPARISON TODAY ---');
    console.log('Sorteo        | Nacional | Provincial');
    console.log('-------------------------------------');
    const sorteos = ['La Previa', 'Primera', 'Matutina', 'Vespertina', 'Nocturna'];
    sorteos.forEach(s => {
        const n = nac.find(r => r.sorteo === s)?.primerPremio ?? '----';
        const p = pro.find(r => r.sorteo === s)?.primerPremio ?? '----';
        console.log(`${s.padEnd(12)} | ${n.padEnd(8)} | ${p}`);
    });
}

check().finally(() => prisma.$disconnect());
