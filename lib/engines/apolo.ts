// MOTOR APOLO - "Vibración de Fecha y Ausencia"
// Calcula: suma de Día + Mes de la fecha actual
// Identifica números que NO han salido en los últimos 20 días en NOCTURNA
// Cruza el resultado de la suma con los números ausentes

import type { PrediccionMotor } from '../types';

interface ResultadoNocturno {
  primerPremio: string;
  fecha: Date;
}

export function motorApolo(
  resultadosNocturnos20dias: ResultadoNocturno[],
  fechaActual?: Date
): PrediccionMotor {
  const fecha = fechaActual ?? new Date();
  const dia = fecha.getDate();
  const mes = fecha.getMonth() + 1; // getMonth() es 0-indexed

  // Suma de día + mes
  const sumaFecha = dia + mes;
  const vibracionBase = sumaFecha % 100;

  // Obtener todas las terminaciones que HAN salido en los últimos 20 días nocturnos
  const terminacionesSalidas = new Set<string>();

  for (const r of resultadosNocturnos20dias ?? []) {
    const premio = r?.primerPremio ?? '';
    if (premio?.length >= 2) {
      const terminacion = premio.slice(-2).padStart(2, '0');
      terminacionesSalidas.add(terminacion);
    }
  }

  // Generar lista de números ausentes (00-99 que no han salido)
  const numerosAusentes: string[] = [];
  for (let i = 0; i < 100; i++) {
    const num = String(i).padStart(2, '0');
    if (!terminacionesSalidas.has(num)) {
      numerosAusentes.push(num);
    }
  }

  if (numerosAusentes.length === 0) {
    // Todos los números han salido, usar vibración base
    return {
      num1: String(vibracionBase).padStart(2, '0'),
      num2: String((vibracionBase + 11) % 100).padStart(2, '0'),
      explicacion: `Sin ausencias. Vibración de fecha: ${dia}+${mes}=${sumaFecha}`,
    };
  }

  // Cruzar vibración con ausentes
  // Buscar números ausentes que contengan dígitos de la vibración
  const vibracionStr = String(vibracionBase).padStart(2, '0');
  const digitosVibracion = new Set(vibracionStr.split(''));

  // Prioridad 1: Números ausentes que comparten dígitos con la vibración
  const ausentesRelacionados = numerosAusentes.filter(num => {
    const digitos = num.split('');
    return digitos.some(d => digitosVibracion.has(d));
  });

  let seleccionado: string;
  let explicacion: string;

  if (ausentesRelacionados.length >= 1) {
    seleccionado = ausentesRelacionados[0];
    explicacion = `Vibración ${dia}+${mes}=${sumaFecha} cruzada con ausentes. Seleccionado: ${seleccionado}`;
  } else if (numerosAusentes.length > 0) {
    seleccionado = numerosAusentes[0];
    explicacion = `Sin cruce directo, sugiriendo primer ausente: ${seleccionado}`;
  } else {
    seleccionado = vibracionStr;
    explicacion = `Sin ausencias, sugiriendo vibración de fecha: ${seleccionado}`;
  }

  return {
    num1: seleccionado,
    num2: '',
    explicacion,
  };
}
