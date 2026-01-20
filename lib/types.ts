export type TipoQuiniela = 'Nacional' | 'Provincial';

export type Sorteo = 'La Previa' | 'Primera' | 'Matutina' | 'Vespertina' | 'Nocturna';

export interface ResultadoHistorico {
  id: string;
  fecha: Date;
  sorteo: Sorteo;
  tipoQuiniela: TipoQuiniela;
  primerPremio: string;
  createdAt: Date;
}

export interface Prediccion {
  id: string;
  fecha: Date;
  sorteo: Sorteo;
  tipoQuiniela: TipoQuiniela;
  zeusNum1: string;
  zeusNum2: string;
  poseidonNum1: string;
  poseidonNum2: string;
  apoloNum1: string;
  apoloNum2: string;
  createdAt: Date;
}

export interface Acierto {
  id: string;
  fecha: Date;
  sorteo: Sorteo;
  tipoQuiniela: TipoQuiniela;
  diosGanador: 'Zeus' | 'Poseidón' | 'Apolo';
  numeroAcertado: string;
  numeroOficial: string;
  createdAt: Date;
}

export interface SorteoConfig {
  nombre: Sorteo;
  hora: string;
  horaActualizacion: string;
}

export const SORTEOS_CONFIG: SorteoConfig[] = [
  { nombre: 'La Previa', hora: '10:15', horaActualizacion: '10:15' },
  { nombre: 'Primera', hora: '11:30', horaActualizacion: '11:30' },
  { nombre: 'Matutina', hora: '14:00', horaActualizacion: '14:00' },
  { nombre: 'Vespertina', hora: '17:30', horaActualizacion: '17:30' },
  { nombre: 'Nocturna', hora: '21:00', horaActualizacion: '21:00' },
];

export interface PrediccionMotor {
  num1: string;
  num2: string;
  explicacion?: string;
}

export interface PrediccionesCompletas {
  zeus: PrediccionMotor;
  poseidon: PrediccionMotor;
  apolo: PrediccionMotor;
}

export interface APILotteryResponse {
  success: boolean;
  data?: {
    nacional?: {
      laPrevia?: string;
      primera?: string;
      matutina?: string;
      vespertina?: string;
      nocturna?: string;
    };
    provincial?: {
      laPrevia?: string;
      primera?: string;
      matutina?: string;
      vespertina?: string;
      nocturna?: string;
    };
  };
  error?: string;
}
