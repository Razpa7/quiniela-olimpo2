
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkPredictions() {
    const targetDate = new Date('2026-01-18');
    targetDate.setHours(0, 0, 0, 0);

    console.log('Checking predictions for:', targetDate);

    const preds = await prisma.prediccion.findMany({
        where: { fecha: targetDate }
    });

    console.log(`Found ${preds.length} predictions.`);
    if (preds.length > 0) {
        console.log('Sample:', preds[0]);
    } else {
        console.log('No predictions found for this date.');
    }

    const results = await prisma.resultadoHistorico.findMany({
        where: { fecha: targetDate }
    });
    console.log(`Found ${results.length} results for this date.`);

    await prisma.$disconnect();
}

checkPredictions();
