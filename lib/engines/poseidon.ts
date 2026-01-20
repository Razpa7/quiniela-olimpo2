// MOTOR POSEIDÓN - "Cifras Indicadoras Progresivas"
// Si el primer premio termina en 01-09, activa la lista progresiva correspondiente

import type { PrediccionMotor } from '../types';

const INDICADORES: Record<string, string[]> = {
  '01': ['01', '12', '23', '34', '45', '56', '67', '78', '89', '90'],
  '02': ['02', '13', '24', '35', '46', '57', '68', '79', '80', '91'],
  '03': ['03', '14', '25', '36', '47', '58', '69', '70', '81', '92'],
  '04': ['04', '15', '26', '37', '48', '59', '60', '71', '82', '93'],
  '05': ['05', '16', '27', '38', '49', '50', '61', '72', '83', '94'],
  '06': ['06', '17', '28', '39', '40', '51', '62', '73', '84', '95'],
  '07': ['07', '18', '29', '30', '41', '52', '63', '74', '85', '96'],
  '08': ['08', '19', '20', '31', '42', '53', '64', '75', '86', '97'],
  '09': ['09', '10', '21', '32', '43', '54', '65', '76', '87', '98'],
};

interface ResultadoSimple {
  primerPremio: string;
}

export function motorPoseidon(ultimoResultado: ResultadoSimple | null): PrediccionMotor {
  if (!ultimoResultado?.primerPremio) {
    // Sin resultado previo, usar lista base
    return {
      num1: '01',
      num2: '12',
      explicacion: 'Sin resultado previo, usando lista base 01',
    };
  }

  const premio = ultimoResultado.primerPremio;
  const terminacion = premio.slice(-2).padStart(2, '0');
  const terminacionInt = parseInt(terminacion, 10);

  // Solo activa si termina en 01-09
  if (terminacionInt >= 1 && terminacionInt <= 9) {
    const clave = terminacionInt.toString().padStart(2, '0');
    const lista = INDICADORES[clave] ?? [];

    if (lista.length > 0) {
      // Tomamos el siguiente en la lista progresiva (o el primero si es el último)
      const currentIdx = lista.indexOf(terminacion);
      const nextIdx = (currentIdx + 1) % lista.length;
      const num1 = lista[nextIdx];

      return {
        num1,
        num2: '',
        explicacion: `Activada lista progresiva por terminal ${clave}. Sugerido: ${num1}`,
      };
    }
  }

  // Si no termina en 01-09, Zeus o Apolo tomarán el mando del azar
  return {
    num1: '11', // Número de Poseidón por defecto
    num2: '',
    explicacion: `Terminal ${terminacion} no activa lista progresiva. Poseidón sugiere su número base.`,
  };
}

export function getListaPoseidon(terminal: string): string[] {
  return INDICADORES[terminal] ?? [];
}
