'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Sparkles, TrendingUp, Trophy as TrophyIcon } from 'lucide-react';
import { toast } from 'sonner';
import { GodCard } from './ui/god-card';
import { Countdown } from './ui/countdown';
import { SorteoCard } from './ui/sorteo-card';
import { QuinielaToggle } from './ui/quiniela-toggle';
import { IntroScreen } from './ui/intro-screen';
import { SORTEOS_CONFIG } from '@/lib/types';
import { useNextSorteo } from '@/lib/hooks';

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

  const fetchData = useCallback(async (isMounted: boolean) => {
    try {
      setLoading(true);

      const [predRes, resRes] = await Promise.all([
        fetch(`/api/predicciones?tipo=${tipo}`, { cache: 'no-store' }),
        fetch(`/api/resultados?tipo=${tipo}&dias=1`, { cache: 'no-store' }),
      ]);

      if (!isMounted) return;

      const predData = await predRes?.json?.().catch(() => ({})) ?? {};
      const resData = await resRes?.json?.().catch(() => ({})) ?? {};

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
      if (isMounted) setLoading(false);
    }
  }, [tipo]);

  const syncData = async () => {
    try {
      setSyncing(true);
      const res = await fetch('/api/sync', { method: 'POST', cache: 'no-store' });
      const data = await res?.json?.().catch(() => ({})) ?? {};

      if (data?.success) {
        toast.success('Sincronización completada', {
          description: `${data?.saved ?? 0} resultados actualizados`,
        });

        if ((data?.aciertos?.length ?? 0) > 0) {
          data.aciertos.forEach((acierto: any) => {
            toast.success('¡ACIERTO CONFIRMADO!', {
              description: `${acierto?.diosGanador} dio en el blanco: ${acierto?.numeroAcertado}`,
              icon: <TrophyIcon className="w-5 h-5 text-gold" />,
              duration: 8000,
            });
          });
        }

        await fetchData(true);
      }
    } catch (error) {
      console.error('Sync error:', error);
      toast.error('Error de conexión', {
        description: 'No se pudo sincronizar con el Olimpo',
      });
    } finally {
      setSyncing(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    if (mounted) {
      fetchData(isMounted);
    }
    return () => { isMounted = false; };
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

  const [showIntro, setShowIntro] = useState(true);
  const nextDraw = useNextSorteo();

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white pb-24 selection:bg-amber-500/30">
      <AnimatePresence>
        {showIntro && <IntroScreen onComplete={() => setShowIntro(false)} />}
      </AnimatePresence>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-xl border-b border-amber-500/20 shadow-xl">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-amber-500 to-yellow-600 p-2 rounded-lg shadow-lg">
                <i className="fas fa-bolt text-white text-xl"></i>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-yellow-400 bg-clip-text text-transparent tracking-tight cinzel-font">
                  OLIMPO <span className="text-blue-400">APP</span>
                </h1>
                <p className="text-[10px] text-slate-400 -mt-1 font-medium tracking-wider">DASHBOARD PREDICTIVO</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="hidden md:flex items-center space-x-2 bg-green-900/30 px-3 py-1.5 rounded-full border border-green-500/30">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-medium text-green-400">API ON</span>
              </div>
              <button
                onClick={syncData}
                disabled={syncing}
                className="relative p-2.5 bg-slate-800/50 hover:bg-slate-700/50 rounded-xl transition-all active:scale-90 border border-white/5"
              >
                <i className={`fas fa-sync-alt text-lg text-amber-400 ${syncing ? 'animate-spin' : ''}`}></i>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {/* Next Draw Hero */}
        <section className="mb-8">
          <div className="bg-gradient-to-br from-blue-900/40 via-slate-900/60 to-slate-900/80 rounded-2xl p-6 border border-blue-500/20 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-[100px] -mr-32 -mt-32"></div>
            <div className="flex flex-col md:flex-row justify-between items-center relative z-10">
              <div className="mb-6 md:mb-0 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-3 mb-3">
                  <span className="bg-blue-500/20 text-blue-400 text-[10px] font-black uppercase px-3 py-1 rounded-full border border-blue-500/30 tracking-widest">
                    Próximo Sorteo
                  </span>
                  <span className="draw-indicator bg-amber-500/20 text-amber-400 text-[10px] font-black uppercase px-3 py-1 rounded-full border border-amber-500/30 tracking-widest">
                    En Vivo
                  </span>
                </div>
                <h2 className="text-3xl md:text-5xl font-black mb-1 flex items-center justify-center md:justify-start gap-4">
                  <span className="text-blue-300 cinzel-font">{nextDraw?.nombre ?? 'CARGANDO'}</span>
                  <span className="text-slate-600 hidden md:block">•</span>
                  <span className="text-2xl md:text-4xl text-white">{nextDraw?.hora ?? '--:--'}</span>
                </h2>
                <div className="flex items-center justify-center md:justify-start gap-3 mt-4">
                  <QuinielaToggle value={tipo} onChange={setTipo} />
                </div>
              </div>

              <div className="text-center bg-black/20 backdrop-blur-md p-6 rounded-3xl border border-white/5 shadow-inner">
                <div className="countdown-font text-5xl md:text-6xl font-black mb-2 bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent">
                  <Countdown onSorteoInminente={handleSorteoInminente} variant="compact" />
                </div>
                <p className="text-slate-400 text-xs font-bold tracking-widest uppercase">
                  <i className="fas fa-clock text-amber-500 mr-2"></i>
                  Cierre en camino
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* God Predictions */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <div className="w-1.5 h-8 bg-gradient-to-b from-amber-500 to-yellow-600 rounded-full mr-4 shadow-[0_0_15px_rgba(245,158,11,0.5)]"></div>
              <h2 className="text-2xl font-black tracking-tight cinzel-font">
                SUGERENCIAS DEL <span className="text-amber-400">OLIMPO</span>
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {motores ? (
              <>
                <div className="god-card god-zeus rounded-3xl p-6 shadow-2xl border border-white/5">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-2xl bg-amber-500/20 flex items-center justify-center border border-amber-500/30 shadow-lg">
                        <i className="fas fa-bolt text-amber-400 text-2xl"></i>
                      </div>
                      <div>
                        <h3 className="text-xl font-black text-amber-400 tracking-wider">ZEUS</h3>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Ley de Repetición</p>
                      </div>
                    </div>
                  </div>
                  <div className="text-center py-6 bg-black/20 rounded-2xl border border-white/5 mb-6">
                    <div className="text-7xl font-black text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">{motores.zeus.num1}</div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
                      <span>Confianza</span>
                      <span className="text-amber-400">Alta</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill bg-gradient-to-r from-amber-500 to-yellow-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]" style={{ width: '85%' }}></div>
                    </div>
                    <p className="text-[10px] text-slate-400 italic line-clamp-2">
                      {motores.zeus.explicacion}
                    </p>
                  </div>
                </div>

                <div className="god-card god-poseidon rounded-3xl p-6 shadow-2xl border border-white/5">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center border border-blue-500/30 shadow-lg">
                        <i className="fas fa-water text-blue-400 text-2xl"></i>
                      </div>
                      <div>
                        <h3 className="text-xl font-black text-blue-400 tracking-wider">POSEIDÓN</h3>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Cifras Indicadoras</p>
                      </div>
                    </div>
                  </div>
                  <div className="text-center py-6 bg-black/20 rounded-2xl border border-white/5 mb-6">
                    <div className="text-7xl font-black text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">{motores.poseidon.num1}</div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
                      <span>Progresión</span>
                      <span className="text-blue-400">Activa</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill bg-gradient-to-r from-blue-500 to-cyan-400 shadow-[0_0_10px_rgba(59,130,246,0.5)]" style={{ width: '92%' }}></div>
                    </div>
                    <p className="text-[10px] text-slate-400 italic line-clamp-2">
                      {motores.poseidon.explicacion}
                    </p>
                  </div>
                </div>

                <div className="god-card god-apolo rounded-3xl p-6 shadow-2xl border border-white/5">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-2xl bg-yellow-500/20 flex items-center justify-center border border-yellow-500/30 shadow-lg">
                        <i className="fas fa-sun text-yellow-400 text-2xl"></i>
                      </div>
                      <div>
                        <h3 className="text-xl font-black text-yellow-400 tracking-wider">APOLO</h3>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Vibración Solar</p>
                      </div>
                    </div>
                  </div>
                  <div className="text-center py-6 bg-black/20 rounded-2xl border border-white/5 mb-6">
                    <div className="text-7xl font-black text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">{motores.apolo.num1}</div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
                      <span>Armonía</span>
                      <span className="text-yellow-400">Estable</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill bg-gradient-to-r from-yellow-500 to-amber-500 shadow-[0_0_10px_rgba(234,179,8,0.5)]" style={{ width: '70%' }}></div>
                    </div>
                    <p className="text-[10px] text-slate-400 italic line-clamp-2">
                      {motores.apolo.explicacion}
                    </p>
                  </div>
                </div>
              </>
            ) : (
              [1, 2, 3].map(i => (
                <div key={i} className="h-64 bg-slate-800/40 rounded-3xl animate-pulse border border-white/5" />
              ))
            )}
          </div>
        </section>

        {/* Timeline Results */}
        <section className="mb-12">
          <div className="flex items-center mb-8">
            <div className="w-1.5 h-8 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full mr-4 shadow-[0_0_15px_rgba(59,130,246,0.5)]"></div>
            <h2 className="text-2xl font-black tracking-tight cinzel-font">
              RESULTADOS <span className="text-blue-400">EN LÍNEA</span>
            </h2>
          </div>

          <div className="lottery-card rounded-3xl p-2 md:p-6 overflow-hidden shadow-2xl">
            <div className="draw-timeline space-y-8 pl-10 pr-4 py-4">
              {SORTEOS_CONFIG.map((sorteo) => {
                const estado = getSorteoEstado(sorteo.nombre);
                const result = resultados?.find(r =>
                  r.sorteo === sorteo.nombre &&
                  (r as any).tipoQuiniela === tipo
                );

                return (
                  <div key={sorteo.nombre} className="relative group/item">
                    <div className={`absolute left-[-35px] top-0 w-8 h-8 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 z-10 
                        ${estado === 'finalizado' ? 'bg-green-500 shadow-green-500/20' :
                        estado === 'en-curso' ? 'bg-amber-500 animate-pulse shadow-amber-500/40' :
                          'bg-slate-700'}`}>
                      <i className={`fas ${estado === 'finalizado' ? 'fa-check' : 'fa-clock'} text-[10px] text-white`}></i>
                    </div>

                    <div className={`p-5 rounded-2xl border transition-all duration-300 ${estado === 'en-curso' ? 'bg-amber-500/10 border-amber-500/30' : 'bg-slate-800/40 border-white/5 hover:border-white/10'}`}>
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <span className={`text-sm font-black tracking-wider ${estado === 'en-curso' ? 'text-amber-400' : 'text-white'}`}>{sorteo.nombre.toUpperCase()}</span>
                            <span className="text-[10px] font-bold text-slate-500">{sorteo.hora}</span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {predicciones.filter(p => p.sorteo === sorteo.nombre).map(p => {
                              const isHit = result?.primerPremio?.slice(-2) === p.predictedNumber;
                              return (
                                <div key={p.id} className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-[9px] font-bold border transition-colors ${isHit ? 'bg-green-500/20 border-green-500/40 text-green-400' : 'bg-slate-800 border-white/5 text-slate-400'}`}>
                                  <span className="uppercase">{p.god}</span>
                                  <span className="text-white font-black">{p.predictedNumber}</span>
                                  {isHit && <i className="fas fa-trophy ml-0.5 animate-bounce"></i>}
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        <div className="flex items-center gap-6">
                          {result ? (
                            <div className="text-right">
                              <div className="text-3xl font-black text-white tracking-widest bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">{result.primerPremio}</div>
                              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Primer Premio</div>
                            </div>
                          ) : (
                            <div className="text-right">
                              <div className="text-sm font-black text-slate-600 animate-pulse">PENDIENTE...</div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Quick Stats */}
        <section className="mb-12 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Aciertos Hoy', val: '3', color: 'green', icon: 'trophy', trend: '+15%' },
            { label: 'Efectividad', val: '68%', color: 'amber', icon: 'crown', trend: 'Poseidón' },
            { label: 'Activas', val: '6', color: 'blue', icon: 'sync-alt', trend: 'Actual' },
            { label: 'Historial', val: '1,2k', color: 'slate', icon: 'database', trend: '30 días' }
          ].map((stat, i) => (
            <div key={i} className="stat-card rounded-2xl p-5 border border-white/5 hover:border-white/10 transition-colors shadow-xl group">
              <div className="flex items-center justify-between mb-3 text-slate-500 group-hover:text-amber-400 transition-colors">
                <span className="text-[10px] font-black uppercase tracking-widest">{stat.label}</span>
                <i className={`fas fa-${stat.icon} text-xs`}></i>
              </div>
              <div className="text-3xl font-black text-white mb-1">{stat.val}</div>
              <div className={`text-[9px] font-bold text-${stat.color}-400 flex items-center gap-1`}>
                <i className="fas fa-circle text-[4px]"></i> {stat.trend}
              </div>
            </div>
          ))}
        </section>
      </main>

      {/* Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-slate-900/90 backdrop-blur-2xl border-t border-white/5 py-4 px-8 z-40 flex justify-around items-center">
        <button className="flex flex-col items-center gap-1.5 text-amber-400 group relative">
          <div className="bg-amber-500/10 p-2 rounded-xl border border-amber-500/20">
            <i className="fas fa-home text-xl"></i>
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest">Inicio</span>
          <div className="absolute -bottom-1 w-1 h-1 bg-amber-500 rounded-full shadow-[0_0_10px_#f59e0b]"></div>
        </button>

        <button onClick={() => window.location.href = '/historial'} className="flex flex-col items-center gap-1.5 text-slate-500 hover:text-white transition-all group">
          <i className="fas fa-history text-xl group-hover:scale-110 transition-transform"></i>
          <span className="text-[10px] font-bold uppercase tracking-widest">Historial</span>
        </button>

        <button className="flex flex-col items-center gap-1.5 text-slate-500 hover:text-white transition-all group">
          <i className="fas fa-chart-pie text-xl group-hover:scale-110 transition-transform"></i>
          <span className="text-[10px] font-bold uppercase tracking-widest">Stats</span>
        </button>

        <button className="flex flex-col items-center gap-1.5 text-slate-500 hover:text-white transition-all group">
          <i className="fas fa-medal text-xl group-hover:scale-110 transition-transform"></i>
          <span className="text-[10px] font-bold uppercase tracking-widest">Premium</span>
        </button>
      </nav>

      {/* Floating Action */}
      <button
        className="fixed bottom-24 right-6 w-14 h-14 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-2xl shadow-[0_10px_30px_rgba(245,158,11,0.3)] flex items-center justify-center text-white z-40 group hover:scale-110 active:scale-95 transition-all"
        onClick={syncData}
      >
        <i className={`fas fa-bolt text-xl transition-transform group-hover:rotate-12 ${syncing ? 'animate-pulse' : ''}`}></i>
      </button>

      <style jsx>{`
        .cinzel-font { font-family: 'Cinzel', serif; }
        .countdown-font { font-family: 'Courier New', monospace; }
      `}</style>
    </div>
  );
}
