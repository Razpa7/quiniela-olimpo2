'use client';

import { motion } from 'framer-motion';
import { Zap, Waves, Music } from 'lucide-react';

interface GodCardProps {
  god: 'zeus' | 'poseidon' | 'apolo';
  num1: string;
  num2: string;
  explicacion?: string;
}

const godConfig = {
  zeus: {
    name: 'Zeus',
    icon: Zap,
    gradient: 'from-yellow-500 via-amber-400 to-yellow-600',
    bgGradient: 'from-yellow-900/40 to-amber-900/20',
    borderColor: 'border-yellow-500/50',
    textColor: 'text-yellow-400',
    glowColor: 'shadow-yellow-500/30',
    subtitle: 'Ley de Repetición',
    emoji: '⚡',
  },
  poseidon: {
    name: 'Poseidón',
    icon: Waves,
    gradient: 'from-cyan-500 via-blue-400 to-cyan-600',
    bgGradient: 'from-cyan-900/40 to-blue-900/20',
    borderColor: 'border-cyan-500/50',
    textColor: 'text-cyan-400',
    glowColor: 'shadow-cyan-500/30',
    subtitle: 'Cifras Progresivas',
    emoji: '🔱',
  },
  apolo: {
    name: 'Apolo',
    icon: Music,
    gradient: 'from-purple-500 via-violet-400 to-pink-500',
    bgGradient: 'from-purple-900/40 to-violet-900/20',
    borderColor: 'border-purple-500/50',
    textColor: 'text-purple-400',
    glowColor: 'shadow-purple-500/30',
    subtitle: 'Vibración & Ausencia',
    emoji: '🎵',
  },
};

export function GodCard({ god, num1, num2, explicacion }: GodCardProps) {
  const config = godConfig[god] ?? godConfig.zeus;
  const Icon = config?.icon ?? Zap;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, y: -5 }}
      transition={{ duration: 0.3 }}
      className={`relative overflow-hidden rounded-2xl border ${config?.borderColor ?? ''} bg-gradient-to-br ${config?.bgGradient ?? ''} p-6 backdrop-blur-sm`}
    >
      {/* Glow effect */}
      <div className={`absolute inset-0 opacity-20 blur-xl bg-gradient-to-br ${config?.gradient ?? ''}`} />

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className={`p-2 rounded-xl bg-gradient-to-br ${config?.gradient ?? ''} shadow-lg ${config?.glowColor ?? ''}`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className={`text-xl font-bold font-greek ${config?.textColor ?? ''}`}>
              {config?.emoji ?? ''} {config?.name ?? ''}
            </h3>
            <p className="text-xs text-gray-400">{config?.subtitle ?? ''}</p>
          </div>
        </div>

        {/* Numbers */}
        <div className="flex justify-center my-6">
          <motion.div
            whileHover={{ scale: 1.1 }}
            className={`w-24 h-28 rounded-xl bg-gradient-to-br ${config?.gradient ?? ''} flex items-center justify-center shadow-lg ${config?.glowColor ?? ''}`}
          >
            <span className="text-5xl font-bold text-white font-mono drop-shadow-md">
              {num1 ?? '00'}
            </span>
          </motion.div>
        </div>

        {/* Explanation */}
        {explicacion && (
          <p className="text-xs text-gray-400 text-center mt-3 line-clamp-2">
            {explicacion}
          </p>
        )}
      </div>

      {/* Decorative elements */}
      <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full bg-gradient-to-br ${config?.gradient ?? ''} opacity-10 blur-2xl`} />
      <div className={`absolute -bottom-10 -left-10 w-24 h-24 rounded-full bg-gradient-to-br ${config?.gradient ?? ''} opacity-10 blur-2xl`} />
    </motion.div>
  );
}
