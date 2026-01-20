import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request?.url ?? '');
    const tipo = searchParams?.get('tipo');
    const mes = searchParams?.get('mes');

    const where: any = {};

    if (tipo) {
      where.tipoQuiniela = tipo;
    }

    if (mes) {
      const [year, month] = mes.split('-').map(Number);
      if (year && month) {
        const inicio = new Date(year, month - 1, 1);
        const fin = new Date(year, month, 0);
        where.fecha = { gte: inicio, lte: fin };
      }
    }

    const aciertos = await prisma?.acierto?.findMany?.({
      where,
      orderBy: [{ fecha: 'desc' }, { createdAt: 'desc' }],
    }) ?? [];

    // Statistics
    const stats = {
      total: aciertos?.length ?? 0,
      zeus: aciertos?.filter((a: { diosGanador?: string }) => a?.diosGanador === 'Zeus')?.length ?? 0,
      poseidon: aciertos?.filter((a: { diosGanador?: string }) => a?.diosGanador === 'Poseidón')?.length ?? 0,
      apolo: aciertos?.filter((a: { diosGanador?: string }) => a?.diosGanador === 'Apolo')?.length ?? 0,
    };

    return NextResponse.json({ success: true, data: aciertos, stats });
  } catch (error) {
    console.error('Error fetching aciertos:', error);
    return NextResponse.json(
      { success: false, error: 'Error al obtener aciertos' },
      { status: 500 }
    );
  }
}

// Verify predictions against results
export async function POST(request: Request) {
  try {
    const body = await request?.json?.() ?? {};
    const { fecha, sorteo, tipoQuiniela, resultado } = body ?? {};

    if (!fecha || !sorteo || !tipoQuiniela || !resultado) {
      return NextResponse.json(
        { success: false, error: 'Faltan parámetros' },
        { status: 400 }
      );
    }

    const fechaDate = new Date(fecha);
    fechaDate.setHours(0, 0, 0, 0);

    // Get prediction for this sorteo
    const prediccion = await prisma?.prediccion?.findFirst?.({
      where: {
        fecha: fechaDate,
        sorteo,
        tipoQuiniela,
      },
    });

    if (!prediccion) {
      return NextResponse.json({ success: true, aciertos: [], message: 'No hay predicción para verificar' });
    }

    const terminacion = resultado?.slice?.(-2)?.padStart?.(2, '0') ?? '';
    const nuevosAciertos = [];

    // Register hits
    for (const godData of [
      { name: 'Zeus', pred: prediccion.predictedNumber, godId: 'Zeus' },
      { name: 'Poseidón', pred: prediccion.god.toLowerCase().includes('poseidon') || prediccion.god.toLowerCase().includes('poseidón') ? prediccion.predictedNumber : null, godId: 'Poseidón' },
      { name: 'Apolo', pred: prediccion.god.toLowerCase() === 'apolo' ? prediccion.predictedNumber : null, godId: 'Apolo' }
    ]) {
      if (godData.pred && terminacion === godData.pred && prediccion.god === godData.godId) {
        const acierto = await prisma.acierto.create({
          data: {
            fecha: fechaDate,
            sorteo,
            tipoQuiniela,
            diosGanador: godData.godId,
            numeroAcertado: terminacion,
            numeroOficial: resultado,
          },
        });
        if (acierto) nuevosAciertos.push(acierto);
      }
    }

    return NextResponse.json({
      success: true,
      aciertos: nuevosAciertos,
      verificado: true,
    });
  } catch (error) {
    console.error('Error verifying:', error);
    return NextResponse.json(
      { success: false, error: 'Error al verificar aciertos' },
      { status: 500 }
    );
  }
}
