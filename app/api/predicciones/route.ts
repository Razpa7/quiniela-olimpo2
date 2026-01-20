import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { motorZeus, motorPoseidon, motorApolo } from '@/lib/engines';
import { SORTEOS_CONFIG } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request?.url ?? '');
    const tipo = searchParams?.get('tipo') ?? 'Provincial';
    const sorteo = searchParams?.get('sorteo');
    const dias = parseInt(searchParams?.get('dias') ?? '0', 10);

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    // If fetching history (dias > 0)
    if (dias > 0) {
      const fechaLimite = new Date();
      fechaLimite.setDate(fechaLimite.getDate() - dias);

      const prediccionesHistoricas = await prisma.prediccion.findMany({
        where: {
          tipoQuiniela: tipo,
          fecha: { gte: fechaLimite },
        },
        orderBy: [{ fecha: 'desc' }, { sorteo: 'asc' }],
      });

      return NextResponse.json({
        success: true,
        data: {
          predicciones: prediccionesHistoricas,
          // No active engines for history
          motores: null,
          ultimoResultado: null,
        },
      });
    }

    // Get historical data for engines - EXCLUDE TODAY to avoid "cheating"
    const hoyTimestamp = hoy.getTime();
    const hace48h = new Date();
    hace48h.setHours(hace48h.getHours() - 48);

    const hace20dias = new Date();
    hace20dias.setDate(hace20dias.getDate() - 20);

    // Data for Zeus (last 48h but BEFORE today)
    const resultados48h = await prisma?.resultadoHistorico?.findMany?.({
      where: {
        tipoQuiniela: tipo,
        fecha: {
          gte: hace48h,
          lt: hoy // Exclude today
        },
      },
      orderBy: { fecha: 'desc' },
    }) ?? [];

    // Data for Poseidon (last result BEFORE today)
    const ultimoResultado = await prisma?.resultadoHistorico?.findFirst?.({
      where: {
        tipoQuiniela: tipo,
        fecha: { lt: hoy }
      },
      orderBy: [{ fecha: 'desc' }, { sorteo: 'desc' }],
    });

    // Data for Apolo (nocturna last 20 days BEFORE today)
    const resultadosNocturnos = await prisma?.resultadoHistorico?.findMany?.({
      where: {
        tipoQuiniela: tipo,
        sorteo: 'Nocturna',
        fecha: {
          gte: hace20dias,
          lt: hoy
        },
      },
      orderBy: { fecha: 'desc' },
    }) ?? [];

    // Generate predictions
    const zeus = motorZeus(resultados48h?.map((r: { primerPremio?: string; fecha?: Date }) => ({
      primerPremio: r?.primerPremio ?? '',
      fecha: r?.fecha ?? new Date(),
    })) ?? []);

    const poseidon = motorPoseidon(ultimoResultado ? {
      primerPremio: ultimoResultado?.primerPremio ?? '',
    } : null);

    const apolo = motorApolo(
      resultadosNocturnos?.map((r: { primerPremio?: string; fecha?: Date }) => ({
        primerPremio: r?.primerPremio ?? '',
        fecha: r?.fecha ?? new Date(),
      })) ?? [],
      new Date()
    );

    // Get or create prediction for each sorteo and each god
    const prediccionesResult = [];
    const sorteosToProcess = sorteo
      ? SORTEOS_CONFIG.filter(s => s?.nombre === sorteo)
      : SORTEOS_CONFIG;

    const godResults = [
      { name: 'Zeus', num: zeus?.num1 ?? '00' },
      { name: 'Poseidón', num: poseidon?.num1 ?? '00' },
      { name: 'Apolo', num: apolo?.num1 ?? '00' }
    ];

    for (const s of sorteosToProcess) {
      for (const godData of godResults) {
        try {
          const prediccion = await prisma.prediccion.upsert({
            where: {
              fecha_sorteo_tipoQuiniela_god: {
                fecha: hoy,
                sorteo: s.nombre,
                tipoQuiniela: tipo,
                god: godData.name
              }
            },
            update: {
              predictedNumber: godData.num,
            },
            create: {
              fecha: hoy,
              sorteo: s.nombre,
              tipoQuiniela: tipo,
              god: godData.name,
              predictedNumber: godData.num,
            },
          });
          if (prediccion) prediccionesResult.push(prediccion);
        } catch (e) {
          console.error(`Error creating prediction for ${godData.name}:`, e);
        }
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        predicciones: prediccionesResult,
        motores: {
          zeus: { ...zeus, nombre: 'Zeus' },
          poseidon: { ...poseidon, nombre: 'Poseidón' },
          apolo: { ...apolo, nombre: 'Apolo' },
        },
        ultimoResultado: ultimoResultado?.primerPremio ?? null,
      },
    });
  } catch (error) {
    console.error('Error in predicciones:', error);
    return NextResponse.json(
      { success: false, error: 'Error al generar predicciones' },
      { status: 500 }
    );
  }
}
