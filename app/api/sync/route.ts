import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { fetchLotteryResults, mapSorteoKeyToName } from '@/lib/api-client';

export const dynamic = 'force-dynamic';

// Sync results from API and verify predictions
export async function POST() {
  try {
    const apiResponse = await fetchLotteryResults();

    if (!apiResponse?.success || !apiResponse?.data) {
      return NextResponse.json({
        success: false,
        error: apiResponse?.error ?? 'Error de API externa'
      });
    }

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const syncResults = {
      saved: 0,
      aciertos: [] as any[],
    };

    const processResults = async (data: Record<string, any>, tipo: string) => {
      for (const [sorteoKey, drawData] of Object.entries(data ?? {})) {
        if (!drawData?.numeros || drawData?.numeros?.length === 0) continue;

        const winningObj = drawData.numeros.find((n: any) => n.posicion === "1");
        const winningNumber = winningObj?.numero;

        if (!winningNumber || winningNumber.length < 4) continue;

        const sorteoName = mapSorteoKeyToName(sorteoKey);
        const primerPremio = winningNumber.slice(-4);

        try {
          // Save result
          await prisma.resultadoHistorico.upsert({
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
          syncResults.saved++;

          // Check for matches in the new prediction structure (one row per god)
          const predicciones = await prisma.prediccion.findMany({
            where: {
              fecha: hoy,
              sorteo: sorteoName,
              tipoQuiniela: tipo,
            },
          });

          if (predicciones && predicciones.length > 0) {
            const terminacion = primerPremio.slice(-2);

            for (const pred of predicciones) {
              if (pred.predictedNumber === terminacion) {
                // Register hit in 'aciertos' table
                const existing = await prisma.acierto.findFirst({
                  where: {
                    fecha: hoy,
                    sorteo: sorteoName,
                    tipoQuiniela: tipo,
                    diosGanador: pred.god,
                  },
                });

                if (!existing) {
                  const acierto = await prisma.acierto.create({
                    data: {
                      fecha: hoy,
                      sorteo: sorteoName,
                      tipoQuiniela: tipo,
                      diosGanador: pred.god,
                      numeroAcertado: terminacion,
                      numeroOficial: primerPremio,
                    },
                  });
                  if (acierto) syncResults.aciertos.push(acierto);

                  // Update prediction row as hit
                  await prisma.prediccion.update({
                    where: { id: pred.id },
                    data: { isHit: true, actualNumber: primerPremio }
                  });
                }
              }
            }
          }
        } catch (e) {
          console.error(`Error processing ${tipo} ${sorteoName}:`, e);
        }
      }
    };

    if (apiResponse.data?.resultados?.Nacional) {
      await processResults(apiResponse.data.resultados.Nacional, 'Nacional');
    }
    if (apiResponse.data?.resultados?.Provincia) {
      await processResults(apiResponse.data.resultados.Provincia, 'Provincial');
    }

    return NextResponse.json({
      success: true,
      ...syncResults,
    });
  } catch (error) {
    console.error('Sync error:', error);
    return NextResponse.json(
      { success: false, error: 'Error de sincronización' },
      { status: 500 }
    );
  }
}
