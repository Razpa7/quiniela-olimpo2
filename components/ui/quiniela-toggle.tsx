'use client';

import { motion } from 'framer-motion';
import { MapPin, Building2 } from 'lucide-react';

interface QuinielaToggleProps {
  value: 'Nacional' | 'Provincial';
  onChange: (value: 'Nacional' | 'Provincial') => void;
}

export function QuinielaToggle({ value, onChange }: QuinielaToggleProps) {
  return (
    <div className="relative flex items-center gap-1 p-1 bg-surface-dark rounded-xl border border-border">
      {/* Animated background */}
      <motion.div
        className="absolute h-[calc(100%-8px)] w-[calc(50%-4px)] bg-gradient-to-r from-gold/20 to-electric/20 rounded-lg"
        animate={{ x: value === 'Nacional' ? 4 : '100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      />

      <button
        onClick={() => onChange?.('Nacional')}
        className={`relative z-10 flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
          value === 'Nacional' ? 'text-gold' : 'text-gray-400 hover:text-gray-200'
        }`}
      >
        <Building2 className="w-4 h-4" />
        <span className="font-medium">Nacional</span>
      </button>

      <button
        onClick={() => onChange?.('Provincial')}
        className={`relative z-10 flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
          value === 'Provincial' ? 'text-electric' : 'text-gray-400 hover:text-gray-200'
        }`}
      >
        <MapPin className="w-4 h-4" />
        <span className="font-medium">Provincial</span>
      </button>
    </div>
  );
}
