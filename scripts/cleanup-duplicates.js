const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function cleanup() {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    console.log('--- CLEANING UP WRONG TODAY RECORDS ---');

    // Matutina 20-01 has 1115, but it should be 19-01's Matutina.
    // If we have both, and the 20-01 one has the SAME number as the 19-01 one, it's likely a duplicate.

    const resultsToday = await prisma.resultadoHistorico.findMany({
        where: { fecha: hoy }
    });

    for (const r of resultsToday) {
        const yesterday = new Date(hoy);
        yesterday.setDate(yesterday.getDate() - 1);

        const prev = await prisma.resultadoHistorico.findFirst({
            where: {
                fecha: yesterday,
                sorteo: r.sorteo,
                tipoQuiniela: r.tipoQuiniela
            }
        });

        if (prev && prev.primerPremio === r.primerPremio) {
            console.log(`Deleting duplicate for ${r.sorteo} (${r.tipoQuiniela}): ${r.primerPremio} (found in yesterday)`);
            await prisma.resultadoHistorico.delete({
                where: { id: r.id }
            });
        }
    }
}

cleanup().finally(() => prisma.$disconnect());
