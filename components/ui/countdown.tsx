'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, AlertCircle } from 'lucide-react';
import { SORTEOS_CONFIG } from '@/lib/types';

interface CountdownProps {
  onSorteoInminente?: (sorteo: string) => void;
}

export function Countdown({ onSorteoInminente }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [nextSorteo, setNextSorteo] = useState<string>('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const calculateTimeLeft = () => {
      const now = new Date();
      const currentMinutes = now.getHours() * 60 + now.getMinutes();

      // Find next sorteo
      for (const sorteo of SORTEOS_CONFIG ?? []) {
        const [hours, minutes] = (sorteo?.hora ?? '00:00').split(':').map(Number);
        const sorteoMinutes = (hours ?? 0) * 60 + (minutes ?? 0);

        if (sorteoMinutes > currentMinutes) {
          const diffMinutes = sorteoMinutes - currentMinutes;
          const diffSeconds = 60 - now.getSeconds();

          setNextSorteo(sorteo?.nombre ?? '');
          setTimeLeft({
            hours: Math.floor((diffMinutes - 1) / 60),
            minutes: (diffMinutes - 1) % 60,
            seconds: diffSeconds === 60 ? 0 : diffSeconds,
          });

          // Notify 15 minutes before
          if (diffMinutes <= 15 && diffMinutes > 14) {
            onSorteoInminente?.(sorteo?.nombre ?? '');
          }

          return;
        }
      }

      // If all sorteos passed, show next day's La Previa
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(10, 15, 0, 0);
      
      const diff = tomorrow.getTime() - now.getTime();
      const h = Math.floor(diff / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);

      setNextSorteo('La Previa (mañana)');
      setTimeLeft({ hours: h, minutes: m, seconds: s });
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, [mounted, onSorteoInminente]);

  if (!mounted) {
    return (
      <div className="glass rounded-2xl p-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-gold" />
          <span className="text-gray-400">Próximo Sorteo</span>
        </div>
        <div className="flex justify-center gap-3">
          {[0, 0, 0].map((_, i) => (
            <div key={i} className="countdown-digit rounded-xl p-4 min-w-[70px]">
              <span className="text-3xl font-bold font-mono text-gold">--</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const isUrgent = timeLeft.hours === 0 && timeLeft.minutes < 15;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`glass rounded-2xl p-6 text-center ${isUrgent ? 'border-2 border-gold animate-pulse' : ''}`}
    >
      <div className="flex items-center justify-center gap-2 mb-2">
        {isUrgent ? (
          <AlertCircle className="w-5 h-5 text-gold animate-bounce" />
        ) : (
          <Clock className="w-5 h-5 text-gold" />
        )}
        <span className="text-gray-400">Próximo Sorteo</span>
      </div>
      
      <h3 className="text-xl font-bold text-gold mb-4 font-greek">{nextSorteo}</h3>
      
      <div className="flex justify-center gap-3">
        <TimeUnit value={timeLeft.hours} label="Horas" />
        <span className="text-3xl font-bold text-gold self-center">:</span>
        <TimeUnit value={timeLeft.minutes} label="Min" />
        <span className="text-3xl font-bold text-gold self-center">:</span>
        <TimeUnit value={timeLeft.seconds} label="Seg" />
      </div>
    </motion.div>
  );
}

function TimeUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="countdown-digit rounded-xl p-4 min-w-[70px]">
      <motion.span
        key={value}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold font-mono text-gold block"
      >
        {String(value ?? 0).padStart(2, '0')}
      </motion.span>
      <span className="text-xs text-gray-500">{label}</span>
    </div>
  );
}
