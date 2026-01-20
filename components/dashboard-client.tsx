'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Sparkles, TrendingUp, Trophy as TrophyIcon } from 'lucide-react';
import { toast } from 'sonner';
import { GodCard } from './ui/god-card';
import { Countdown } from './ui/countdown';
import { SorteoCard } from './ui/sorteo-card';
import { QuinielaToggle } from './ui/quiniela-toggle';
import { SORTEOS_CONFIG } from '@/lib/types';

interface MotorData {
  num1: string;
  num2: string;
  explicacion?: string;
  nombre?: string;
}

interface PrediccionData {
  id: string;
  fecha: string;
  sorteo: string;
  tipoQuiniela: string;
  god: string;
  predictedNumber: string;
}

interface ResultadoData {
  fecha: string;
  sorteo: string;
  primerPremio: string;
}

export function DashboardClient() {
  const [tipo, setTipo] = useState<'Nacional' | 'Provincial'>('Provincial');
  const [motores, setMotores] = useState<{ zeus: MotorData; poseidon: MotorData; apolo: MotorData } | null>(null);
  const [predicciones, setPredicciones] = useState<PrediccionData[]>([]);
  const [resultados, setResultados] = useState<ResultadoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);

      const [predRes, resRes] = await Promise.all([
        fetch(`/api/predicciones?tipo=${tipo}`),
        fetch(`/api/resultados?tipo=${tipo}&dias=1`),
      ]);

      const predData = await predRes?.json?.() ?? {};
      const resData = await resRes?.json?.() ?? {};

      if (predData?.success) {
        setMotores(predData?.data?.motores ?? null);
        setPredicciones(predData?.data?.predicciones ?? []);
      }

      if (resData?.success) {
        setResultados(resData?.data ?? []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }, [tipo]);

  const syncData = async () => {
    try {
      setSyncing(true);
      const res = await fetch('/api/sync', { method: 'POST' });
      const data = await res?.json?.() ?? {};

      if (data?.success) {
        toast.success('Sincronización completada', {
          description: `${data?.saved ?? 0} resultados guardados`,
        });

        if ((data?.aciertos?.length ?? 0) > 0) {
          data.aciertos.forEach((acierto: any) => {
            toast.success('¡ACIERTO DEL OLIMPO!', {
              description: `${acierto?.diosGanador} acertó el ${acierto?.numeroAcertado} en ${acierto?.sorteo}`,
              icon: <TrophyIcon className="w-5 h-5 text-gold" />,
              duration: 10000,
            });
          });
        }

        await fetchData();
      }
    } catch (error) {
      console.error('Sync error:', error);
      toast.error('Error de sincronización', {
        description: 'No se pudo conectar con la API de lotería',
      });
    } finally {
      setSyncing(false);
    }
  };

  useEffect(() => {
    if (mounted) {
      fetchData();
    }
  }, [mounted, fetchData]);

  const handleSorteoInminente = useCallback((sorteo: string) => {
    toast.warning('¡Sorteo Inminente!', {
      description: `${sorteo} comienza en 15 minutos`,
    });
  }, []);

  const getSorteoEstado = (sorteo: string): 'pendiente' | 'en-curso' | 'finalizado' => {
    const resultado = resultados?.find(r => r?.sorteo === sorteo);
    if (resultado?.primerPremio) return 'finalizado';

    const config = SORTEOS_CONFIG?.find(s => s?.nombre === sorteo);
    if (!config) return 'pendiente';

    const now = new Date();
    const [h, m] = (config?.hora ?? '00:00').split(':').map(Number);
    const sorteoTime = (h ?? 0) * 60 + (m ?? 0);
    const currentTime = now.getHours() * 60 + now.getMinutes();

    if (Math.abs(currentTime - sorteoTime) < 15) return 'en-curso';
    if (currentTime > sorteoTime) return 'finalizado';
    return 'pendiente';
  };

  const getPrediccionForSorteo = (sorteo: string) => {
    const sorteoPreds = predicciones?.filter(p => p?.sorteo === sorteo);
    if (!sorteoPreds?.length) return undefined;

    return {
      zeus: { num1: sorteoPreds.find(p => p.god.toLowerCase() === 'zeus')?.predictedNumber ?? '00', num2: '' },
      poseidon: { num1: sorteoPreds.find(p => p.god.toLowerCase() === 'poseidón' || p.god.toLowerCase() === 'poseidon')?.predictedNumber ?? '00', num2: '' },
      apolo: { num1: sorteoPreds.find(p => p.god.toLowerCase() === 'apolo')?.predictedNumber ?? '00', num2: '' },
    };
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-gold border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20"> {/* pb-20 for bottom nav space */}

      {/* Hero Section */}
      <div className="px-6 pt-8 pb-4">
        {/* Header Title */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold font-greek text-gold">Sugerencias del Olimpo</h1>
            <p className="text-sm text-gray-400">Predicciones y resultados</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={syncData}
              disabled={syncing}
              className="p-2 rounded-full glass border border-gold/30 text-gold active:scale-95 transition-all"
            >
              <RefreshCw className={`w-5 h-5 ${syncing ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Toggle */}
        <div className="mb-6 flex justify-center">
          <QuinielaToggle value={tipo} onChange={setTipo} />
        </div>

        {/* Main Hero Card (Highlighted God - Could be rotational or static 'Zeus' for now as 'Tu Favorito') */}
        {motores && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass border border-gold/30 rounded-2xl p-4 md:p-6 mb-6 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-gold/10 to-transparent pointer-events-none" />
            <div className="flex flex-col items-center text-center relative z-10">
              <span className="text-[10px] md:text-xs font-bold text-gold tracking-widest uppercase mb-1">Tu Favorito de Hoy</span>
              <div className="flex items-center gap-2 mb-3">
                <TrophyIcon className="w-3 h-3 md:w-4 md:h-4 text-gold" />
                <span className="text-white font-bold text-sm md:text-base">{motores.zeus.nombre}</span>
              </div>

              <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg shadow-gold/20 mb-2">
                <span className="text-4xl md:text-5xl font-bold text-white font-mono">{motores.zeus.num1}</span>
              </div>
              <p className="text-[10px] md:text-xs text-gray-400 mt-2 max-w-[200px] line-clamp-2 leading-tight">{motores.zeus.explicacion}</p>
            </div>
          </motion.div>
        )}

        {/* Gods Row */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3 px-1">
            <Sparkles className="w-4 h-4 text-electric" />
            <h3 className="font-bold text-base md:text-lg text-white">Los Tres Grandes</h3>
          </div>

          {/* Grid for Gods */}
          <div className="grid grid-cols-3 gap-2 md:gap-3">
            {motores ? (
              <>
                {/* Small God Cards */}
                <div className="glass border border-yellow-500/30 bg-yellow-900/10 rounded-xl p-2 md:p-3 flex flex-col items-center text-center">
                  <span className="text-[9px] md:text-[10px] text-yellow-400 font-bold uppercase mb-1">Zeus</span>
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-gradient-to-br from-yellow-500 to-amber-600 flex items-center justify-center mb-1 shadow-sm">
                    <span className="text-sm md:text-lg font-bold text-white font-mono">{motores.zeus.num1}</span>
                  </div>
                </div>
                <div className="glass border border-cyan-500/30 bg-cyan-900/10 rounded-xl p-2 md:p-3 flex flex-col items-center text-center">
                  <span className="text-[9px] md:text-[10px] text-cyan-400 font-bold uppercase mb-1">Poseidón</span>
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mb-1 shadow-sm">
                    <span className="text-sm md:text-lg font-bold text-white font-mono">{motores.poseidon.num1}</span>
                  </div>
                </div>
                <div className="glass border border-purple-500/30 bg-purple-900/10 rounded-xl p-2 md:p-3 flex flex-col items-center text-center">
                  <span className="text-[9px] md:text-[10px] text-purple-400 font-bold uppercase mb-1">Apolo</span>
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center mb-1 shadow-sm">
                    <span className="text-sm md:text-lg font-bold text-white font-mono">{motores.apolo.num1}</span>
                  </div>
                </div>
              </>
            ) : (
              [1, 2, 3].map(i => <div key={i} className="h-20 bg-surface/50 rounded-xl animate-pulse" />)
            )}
          </div>
        </div>

        {/* Sorteos Section */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-4 px-1">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-electric" />
              <h3 className="font-bold text-lg text-white">Sorteos del Día</h3>
            </div>
            <span className="text-xs text-gray-500 bg-surface px-2 py-1 rounded-full">{tipo}</span>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-4 snap-x hide-scrollbar">
            {SORTEOS_CONFIG.map((sorteo) => {
              const estado = getSorteoEstado(sorteo.nombre);
              const result = resultados?.find(r => r.sorteo === sorteo.nombre)?.primerPremio;

              return (
                <div key={sorteo.nombre} className="min-w-[140px] snap-center">
                  <SorteoCard
                    nombre={sorteo.nombre}
                    hora={sorteo.hora}
                    resultado={result}
                    predicciones={getPrediccionForSorteo(sorteo.nombre)}
                    estado={estado}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 glass border-t border-border p-2 z-50">
        <div className="flex justify-around items-center">
          <button className="flex flex-col items-center gap-1 p-2 text-gold">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            <span className="text-[10px] font-medium">Dashboard</span>
          </button>
          <button onClick={() => window.location.href = '/historial'} className="flex flex-col items-center gap-1 p-2 text-gray-500 hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
            <span className="text-[10px] font-medium">Resultados</span>
          </button>
          <button onClick={() => window.location.href = '/historial'} className="flex flex-col items-center gap-1 p-2 text-gray-500 hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-[10px] font-medium">Historial</span>
          </button>
        </div>
      </div>

    </div>
  );
}
