import { PrismaClient } from '@prisma/client';
import { motorZeus, motorPoseidon, motorApolo } from '../lib/engines';
import { SORTEOS_CONFIG } from '../lib/types';

const prisma = new PrismaClient();

async function main() {
    console.log('Generating historical predictions (Fast Mode)...');

    // Clear existing for a clean start
    await prisma.acierto.deleteMany({});
    await prisma.prediccion.deleteMany({});

    // Get all dates from results
    const results = await prisma.resultadoHistorico.findMany({
        orderBy: { fecha: 'asc' }
    });

    if (results.length === 0) {
        console.log('No results found. Run seed-history first.');
        return;
    }

    const uniqueDates = Array.from(new Set(results.map(r => r.fecha.toISOString().split('T')[0])));

    const allPredictions = [];
    const allAciertos = [];

    for (const dateStr of uniqueDates) {
        const date = new Date(dateStr);
        console.log(`Analyzing ${dateStr}...`);

        for (const tipo of ['Provincial', 'Nacional']) {
            const h48 = new Date(date);
            h48.setHours(h48.getHours() - 48);

            const h20d = new Date(date);
            h20d.setDate(h20d.getDate() - 20);

            const res48h = results.filter(r => r.tipoQuiniela === tipo && r.fecha <= date && r.fecha >= h48);
            const lastRes = results.filter(r => r.tipoQuiniela === tipo && r.fecha < date).sort((a, b) => b.fecha.getTime() - a.fecha.getTime())[0];
            const resNocturnos = results.filter(r => r.tipoQuiniela === tipo && r.sorteo === 'Nocturna' && r.fecha <= date && r.fecha >= h20d);

            const zeus = motorZeus(res48h.map((r: any) => ({ primerPremio: r.primerPremio, fecha: r.fecha })));
            const poseidon = motorPoseidon(lastRes ? { primerPremio: lastRes.primerPremio } : null);
            const apolo = motorApolo(resNocturnos.map((r: any) => ({ primerPremio: r.primerPremio, fecha: r.fecha })), date);

            const gods = [
                { name: 'Zeus', num: zeus.num1 },
                { name: 'Poseidón', num: poseidon.num1 },
                { name: 'Apolo', num: apolo.num1 }
            ];

            for (const s of SORTEOS_CONFIG) {
                const dayResult = results.find(r =>
                    r.fecha.toISOString().split('T')[0] === dateStr &&
                    r.sorteo === s.nombre &&
                    r.tipoQuiniela === tipo
                );

                for (const god of gods) {
                    const isHit = dayResult ? dayResult.primerPremio.endsWith(god.num) : false;

                    allPredictions.push({
                        fecha: date,
                        sorteo: s.nombre,
                        tipoQuiniela: tipo,
                        god: god.name,
                        predictedNumber: god.num,
                        isHit: isHit,
                        actualNumber: isHit ? dayResult?.primerPremio : null
                    });

                    if (isHit && dayResult) {
                        allAciertos.push({
                            fecha: date,
                            sorteo: s.nombre,
                            tipoQuiniela: tipo,
                            diosGanador: god.name,
                            numeroAcertado: god.num,
                            numeroOficial: dayResult.primerPremio
                        });
                    }
                }
            }
        }
    }

    console.log(`Saving ${allPredictions.length} predictions and ${allAciertos.length} hits...`);

    // Batch insert (Prisma createMany is safer)
    for (let i = 0; i < allPredictions.length; i += 50) {
        const batch = allPredictions.slice(i, i + 50);
        await Promise.all(batch.map(p => prisma.prediccion.create({ data: p })));
    }

    for (const a of allAciertos) {
        await prisma.acierto.create({ data: a });
    }

    console.log('Historical data generated successfully.');
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
