import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { fetchLotteryResults, mapSorteoKeyToName } from '@/lib/api-client';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request?.url ?? '');
    const tipo = searchParams?.get('tipo') ?? 'Provincial';
    const dias = parseInt(searchParams?.get('dias') ?? '7', 10);

    const fechaLimite = new Date();
    fechaLimite.setDate(fechaLimite.getDate() - dias);

    const resultados = await prisma?.resultadoHistorico?.findMany?.({
      where: {
        tipoQuiniela: tipo,
        fecha: { gte: fechaLimite },
      },
      orderBy: [{ fecha: 'desc' }, { sorteo: 'asc' }],
    }) ?? [];

    return NextResponse.json({ success: true, data: resultados });
  } catch (error) {
    console.error('Error fetching resultados:', error);
    return NextResponse.json(
      { success: false, error: 'Error al obtener resultados' },
      { status: 500 }
    );
  }
}

export async function POST() {
  try {
    // Fetch from external API and save
    const apiResponse = await fetchLotteryResults();

    if (!apiResponse?.success || !apiResponse?.data) {
      return NextResponse.json(
        { success: false, error: apiResponse?.error ?? 'Error de API' },
        { status: 500 }
      );
    }

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const saved = [];

    // Process Nacional
    if (apiResponse.data?.resultados?.Nacional) {
      for (const [sorteoKey, drawData] of Object.entries(apiResponse.data.resultados.Nacional ?? {})) {
        if (drawData?.numeros && drawData.numeros.length > 0) {
          const winningNumber = drawData.numeros.find(n => n.posicion === "1")?.numero;

          if (winningNumber && winningNumber.length >= 4) {
            const sorteoName = mapSorteoKeyToName(sorteoKey);
            try {
              const result = await prisma?.resultadoHistorico?.upsert?.({
                where: {
                  fecha_sorteo_tipoQuiniela: {
                    fecha: hoy,
                    sorteo: sorteoName,
                    tipoQuiniela: 'Nacional',
                  },
                },
                update: {
                  primerPremio: winningNumber.slice(-4),
                  ultimoDos: winningNumber.slice(-2)
                },
                create: {
                  fecha: hoy,
                  sorteo: sorteoName,
                  tipoQuiniela: 'Nacional',
                  primerPremio: winningNumber.slice(-4),
                  ultimoDos: winningNumber.slice(-2)
                },
              });
              if (result) saved.push(result);
            } catch (e) {
              console.error('Error saving nacional result:', e);
            }
          }
        }
      }
    }

    // Process Provincial
    if (apiResponse.data?.resultados?.Provincia) {
      for (const [sorteoKey, drawData] of Object.entries(apiResponse.data.resultados.Provincia ?? {})) {
        if (drawData?.numeros && drawData.numeros.length > 0) {
          const winningNumber = drawData.numeros.find(n => n.posicion === "1")?.numero;

          if (winningNumber && winningNumber.length >= 4) {
            const sorteoName = mapSorteoKeyToName(sorteoKey);
            try {
              const result = await prisma?.resultadoHistorico?.upsert?.({
                where: {
                  fecha_sorteo_tipoQuiniela: {
                    fecha: hoy,
                    sorteo: sorteoName,
                    tipoQuiniela: 'Provincial',
                  },
                },
                update: {
                  primerPremio: winningNumber.slice(-4),
                  ultimoDos: winningNumber.slice(-2)
                },
                create: {
                  fecha: hoy,
                  sorteo: sorteoName,
                  tipoQuiniela: 'Provincial',
                  primerPremio: winningNumber.slice(-4),
                  ultimoDos: winningNumber.slice(-2),
                },
              });
              if (result) saved.push(result);
            } catch (e) {
              console.error('Error saving provincial result:', e);
            }
          }
        }
      }
    }

    return NextResponse.json({ success: true, saved: saved.length });
  } catch (error) {
    console.error('Error in POST resultados:', error);
    return NextResponse.json(
      { success: false, error: 'Error al guardar resultados' },
      { status: 500 }
    );
  }
}
