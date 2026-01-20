// MOTOR ZEUS - "Ley de Repetición"
// Analiza números que aparecieron en las últimas 48 horas
// Prioriza números que repiten con mayor frecuencia

import type { PrediccionMotor } from '../types';

interface ResultadoSimple {
  primerPremio: string;
  fecha: Date;
}

export function motorZeus(resultados48h: ResultadoSimple[]): PrediccionMotor {
  if (!resultados48h?.length) {
    return { num1: '00', num2: '99', explicacion: 'Sin datos suficientes' };
  }

  // Extraer las últimas 2 cifras de cada resultado
  const terminaciones: string[] = [];

  for (const r of resultados48h ?? []) {
    const premio = r?.primerPremio ?? '';
    if (premio?.length >= 2) {
      const terminacion = premio.slice(-2).padStart(2, '0');
      terminaciones.push(terminacion);
    }
  }

  // Contar frecuencia de cada terminación
  const frecuencias: Record<string, number> = {};

  for (const term of terminaciones) {
    frecuencias[term] = (frecuencias[term] ?? 0) + 1;
  }

  // Ordenar por frecuencia descendente
  const ordenados = Object.entries(frecuencias)
    .sort((a, b) => b[1] - a[1])
    .map(([num]) => num);

  // Si no hay suficientes repeticiones, usar los más recientes
  if (ordenados.length === 0) {
    return { num1: '00', num2: '99', explicacion: 'Sin repeticiones encontradas' };
  }

  const num1 = ordenados[0] ?? '00';

  return {
    num1,
    num2: '', // Solo 1 número
    explicacion: `Número más frecuente (${num1}) en las últimas 48h`,
  };
}
