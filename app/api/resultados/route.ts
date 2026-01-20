import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { fetchLotteryResults, mapSorteoKeyToName, parseDrawDate } from '@/lib/api-client';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request?.url ?? '');
    const tipo = searchParams?.get('tipo') ?? 'Provincial';
    console.log(`[API] Fetching results for: ${tipo}`);
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
    const apiResponse = await fetchLotteryResults();

    if (!apiResponse?.success || !apiResponse?.data) {
      return NextResponse.json(
        { success: false, error: 'Error de API' },
        { status: 500 }
      );
    }

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const savedCount = { count: 0 };

    const processResults = async (results: any, tipo: string) => {
      for (const [key, drawData] of Object.entries(results ?? {}) as [string, any][]) {
        const winningNumber = drawData.numeros?.find((n: any) => n.posicion === "1")?.numero;
        if (winningNumber && winningNumber.length >= 4) {
          const sorteoName = mapSorteoKeyToName(key);
          const prize = winningNumber.slice(-4);
          const targetDate = parseDrawDate(drawData.titulo, hoy);

          await prisma.resultadoHistorico.upsert({
            where: {
              fecha_sorteo_tipoQuiniela: {
                fecha: targetDate,
                sorteo: sorteoName,
                tipoQuiniela: tipo,
              },
            },
            update: { primerPremio: prize, ultimoDos: prize.slice(-2) },
            create: {
              fecha: targetDate,
              sorteo: sorteoName,
              tipoQuiniela: tipo,
              primerPremio: prize,
              ultimoDos: prize.slice(-2)
            },
          });
          savedCount.count++;
        }
      }
    };

    if (apiResponse.data?.resultados?.Nacional) {
      await processResults(apiResponse.data.resultados.Nacional, 'Nacional');
    }
    if (apiResponse.data?.resultados?.Provincia) {
      await processResults(apiResponse.data.resultados.Provincia, 'Provincial');
    }

    return NextResponse.json({ success: true, count: savedCount.count });
  } catch (error) {
    console.error('Error in POST resultados:', error);
    return NextResponse.json({ success: false, error: 'Error interno' }, { status: 500 });
  }
}
