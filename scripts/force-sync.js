const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const API_ENDPOINT = 'https://lottery-api-app.vercel.app/api/lottery';
const API_KEY = 'quiniela-master-key-2026';

async function sync() {
    console.log('Starting forced sync with correct structure...');
    const response = await fetch(API_ENDPOINT, {
        headers: { 'x-api-key': API_KEY }
    });
    const data = await response.json();

    if (!data.resultados) {
        console.error('API Error: No "resultados" in response');
        console.log('Keys found:', Object.keys(data));
        return;
    }

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const mapSorteoKeyToName = (key) => {
        const mapping = {
            Previa: 'La Previa',
            Primera: 'Primera',
            Matutina: 'Matutina',
            Vespertina: 'Vespertina',
            Nocturna: 'Nocturna',
        };
        return mapping[key] ?? key;
    };

    const processResults = async (results, tipo) => {
        console.log(`\n--- PROCESSING ${tipo} ---`);
        for (const [key, draw] of Object.entries(results)) {
            const winner = draw.numeros.find(n => n.posicion === "1")?.numero;
            if (!winner) continue;

            const name = mapSorteoKeyToName(key);
            const prize = winner.slice(-4);

            // EXTRACT DATE FROM TITULO
            const match = draw.titulo.match(/(\d{2})-(\d{2})/);
            let drawDate = new Date(hoy);
            if (match) {
                drawDate.setDate(parseInt(match[1]));
                drawDate.setMonth(parseInt(match[2]) - 1);
            }

            console.log(`  ${name}: ${prize} (Source: ${draw.titulo}) -> Target Date: ${drawDate.toISOString().split('T')[0]}`);

            await prisma.resultadoHistorico.upsert({
                where: {
                    fecha_sorteo_tipoQuiniela: {
                        fecha: drawDate,
                        sorteo: name,
                        tipoQuiniela: tipo,
                    },
                },
                update: { primerPremio: prize, ultimoDos: prize.slice(-2) },
                create: {
                    fecha: drawDate,
                    sorteo: name,
                    tipoQuiniela: tipo,
                    primerPremio: prize,
                    ultimoDos: prize.slice(-2)
                },
            });
        }
    };

    if (data.resultados.Nacional) await processResults(data.resultados.Nacional, 'Nacional');
    if (data.resultados.Provincia) await processResults(data.resultados.Provincia, 'Provincial');
}

sync().finally(() => prisma.$disconnect());
