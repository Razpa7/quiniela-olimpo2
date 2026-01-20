const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function count() {
    try {
        const results = await prisma.resultadoHistorico.count();
        const preds = await prisma.prediccion.count();
        const aciertos = await prisma.acierto.count();
        console.log(`Results: ${results}, Preds: ${preds}, Aciertos: ${aciertos}`);
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

count();
