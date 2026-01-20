'use client';

import { motion } from 'framer-motion';
import { Clock, Trophy, Zap, Waves, Music } from 'lucide-react';

interface SorteoCardProps {
  nombre: string;
  hora: string;
  resultado?: string;
  predicciones?: {
    zeus: { num1: string; num2?: string };
    poseidon: { num1: string; num2?: string };
    apolo: { num1: string; num2?: string };
  };
  estado: 'pendiente' | 'en-curso' | 'finalizado';
}

export function SorteoCard({ nombre, hora, resultado, predicciones, estado }: SorteoCardProps) {
  const estadoConfig = {
    pendiente: { bg: 'bg-surface', border: 'border-border', badge: 'bg-gray-600', text: 'Pendiente' },
    'en-curso': { bg: 'bg-surface', border: 'border-gold', badge: 'bg-gold', text: 'En Curso' },
    finalizado: { bg: 'bg-surface-dark', border: 'border-electric', badge: 'bg-electric', text: 'Finalizado' },
  };

  const config = estadoConfig[estado ?? 'pendiente'] ?? estadoConfig.pendiente;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3 }}
      className={`${config?.bg ?? ''} border ${config?.border ?? ''} rounded-xl p-4 relative overflow-hidden`}
    >
      {/* Status badge */}
      {/* Header with Time and Status */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-gold" />
          <span className="text-gold font-bold text-sm">{hora ?? '--:--'}</span>
        </div>
        <div className={`${config?.badge ?? ''} px-2 py-0.5 rounded-full text-[10px] font-bold text-black uppercase tracking-wider`}>
          {config?.text ?? ''}
        </div>
      </div>
      <h4 className="text-lg font-bold text-white mb-3 font-greek">{nombre ?? ''}</h4>

      {/* Result */}
      {estado === 'finalizado' && resultado && (
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-1">
            <Trophy className="w-4 h-4 text-gold" />
            <span className="text-sm text-gray-400">Resultado</span>
          </div>
          <div className="text-2xl font-bold font-mono text-electric">
            {resultado ?? '----'}
          </div>
        </div>
      )}

      {/* Predictions */}
      {predicciones && (
        <div className="space-y-2 mt-4">
          <div className="text-xs text-gray-500 mb-2">Predicciones</div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1">
              <Zap className="w-3 h-3 text-yellow-400" />
              <span className="text-yellow-400">Zeus</span>
            </div>
            <span className="font-mono text-white">
              {predicciones?.zeus?.num1 ?? '00'}
            </span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1">
              <Waves className="w-3 h-3 text-cyan-400" />
              <span className="text-cyan-400">Poseidón</span>
            </div>
            <span className="font-mono text-white">
              {predicciones?.poseidon?.num1 ?? '00'}
            </span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1">
              <Music className="w-3 h-3 text-purple-400" />
              <span className="text-purple-400">Apolo</span>
            </div>
            <span className="font-mono text-white">
              {predicciones?.apolo?.num1 ?? '00'}
            </span>
          </div>
        </div>
      )}

      {/* Decorative */}
      {estado === 'en-curso' && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-gold via-electric to-gold animate-pulse" />
      )}
    </motion.div>
  );
}
