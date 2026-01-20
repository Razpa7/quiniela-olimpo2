// Cliente API para la Quiniela Argentina

const API_ENDPOINT = 'https://lottery-api-app.vercel.app/api/lottery';
const API_KEY = 'quiniela-master-key-2026';

export interface DrawData {
  titulo: string;
  fecha?: string;
  estado?: string;
  a_la_cabeza: string;
  numeros: Array<{ posicion: string; numero: string }>;
}

export interface LotteryAPIResponse {
  success: boolean;
  data?: {
    resultados: {
      Nacional?: Record<string, DrawData>;
      Provincia?: Record<string, DrawData>;
    };
    fecha_peticion?: string;
  };
  error?: string;
}

export async function fetchLotteryResults(): Promise<LotteryAPIResponse> {
  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'GET',
      headers: {
        'x-api-key': API_KEY,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response?.ok) {
      // Log the error text for debugging
      const text = await response.text();
      console.error(`API Error ${response.status}: ${text}`);
      throw new Error(`API Error: ${response?.status}`);
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('Error fetching lottery results:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
}

export function mapSorteoKeyToName(key: string): string {
  const mapping: Record<string, string> = {
    Previa: 'La Previa',
    Primera: 'Primera',
    Matutina: 'Matutina',
    Vespertina: 'Vespertina',
    Nocturna: 'Nocturna',
  };
  return mapping[key] ?? key;
}

export function mapSorteoNameToKey(name: string): string {
  const mapping: Record<string, string> = {
    'La Previa': 'Previa',
    'Primera': 'Primera',
    'Matutina': 'Matutina',
    'Vespertina': 'Vespertina',
    'Nocturna': 'Nocturna',
  };
  return mapping[name] ?? name;
}

export function parseDrawDate(titulo: string, defaultDate: Date): Date {
  const match = titulo.match(/(\d{2})-(\d{2})/);
  if (match) {
    const day = parseInt(match[1]);
    const month = parseInt(match[2]) - 1;
    const date = new Date(defaultDate);
    date.setDate(day);
    date.setMonth(month);
    date.setHours(0, 0, 0, 0);
    return date;
  }
  return defaultDate;
}
