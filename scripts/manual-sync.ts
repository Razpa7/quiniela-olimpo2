
import { PrismaClient } from '@prisma/client';
import { fetchLotteryResults, mapSorteoKeyToName } from '../lib/api-client';

const prisma = new PrismaClient();

async function manualSync() {
    console.log('Starting manual sync...');
    const apiResponse = await fetchLotteryResults();

    if (!apiResponse.success || !apiResponse.data) {
        console.error('API Error:', apiResponse.error);
        return;
    }

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    // Helper function
    const processResults = async (data: Record<string, any>, tipo: string) => {
        console.log(`Processing ${tipo} with keys:`, Object.keys(data));
        for (const [sorteoKey, drawData] of Object.entries(data ?? {})) {
            console.log(`  Checking ${sorteoKey}...`);

            if (!drawData?.numeros || drawData?.numeros?.length === 0) {
                console.log(`  No numbers for ${sorteoKey}`);
                continue;
            }

            const winningObj = drawData.numeros.find((n: any) => n.posicion === "1");
            const winningNumber = winningObj?.numero;

            console.log(`  Winner for ${sorteoKey}: ${winningNumber}`);

            if (!winningNumber || winningNumber.length < 4) continue;

            const sorteoName = mapSorteoKeyToName(sorteoKey);
            const primerPremio = winningNumber.slice(-4);

            try {
                // Save result
                const res = await prisma.resultadoHistorico.upsert({
                    where: {
                        fecha_sorteo_tipoQuiniela: {
                            fecha: hoy,
                            sorteo: sorteoName,
                            tipoQuiniela: tipo,
                        },
                    },
                    update: {
                        primerPremio,
                        ultimoDos: primerPremio.slice(-2)
                    },
                    create: {
                        fecha: hoy,
                        sorteo: sorteoName,
                        tipoQuiniela: tipo,
                        primerPremio,
                        ultimoDos: primerPremio.slice(-2)
                    },
                });
                console.log(`  Saved ${sorteoName}: ${res.primerPremio}`);

            } catch (e) {
                console.error(`  Error processing ${tipo} ${sorteoName}:`, e);
            }
        }
    };

    if (apiResponse.data?.resultados?.Nacional) {
        await processResults(apiResponse.data.resultados.Nacional, 'Nacional');
    } else {
        console.log('No Nacional results found in API response');
    }

    if (apiResponse.data?.resultados?.Provincia) {
        await processResults(apiResponse.data.resultados.Provincia, 'Provincial');
    } else {
        console.log('No Provincia results found in API response');
    }
}

manualSync()
    .catch(console.error)
    .finally(async () => await prisma.$disconnect());
