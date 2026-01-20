'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Calendar, Filter, Zap, Waves, Music, CheckCircle, XCircle } from 'lucide-react';
import { QuinielaToggle } from '@/components/ui/quiniela-toggle';
import { StatsChart } from '@/components/ui/stats-chart';

interface Acierto {
  id: string;
  fecha: string;
  sorteo: string;
  tipoQuiniela: string;
  diosGanador: string;
  numeroAcertado: string;
  numeroOficial: string;
}

interface Prediccion {
  id: string;
  fecha: string;
  sorteo: string;
  tipoQuiniela: string;
  god: string;
  predictedNumber: string;
}

interface Resultado {
  id: string;
  fecha: string;
  sorteo: string;
  tipoQuiniela: string;
  primerPremio: string;
}

interface Stats {
  total: number;
  zeus: number;
  poseidon: number;
  apolo: number;
}

export function HistorialClient() {
  const [tipo, setTipo] = useState<'Nacional' | 'Provincial'>('Provincial');
  const [aciertos, setAciertos] = useState<Acierto[]>([]);
  const [predicciones, setPredicciones] = useState<Prediccion[]>([]);
  const [resultados, setResultados] = useState<Resultado[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, zeus: 0, poseidon: 0, apolo: 0 });
  const [loading, setLoading] = useState(true);
  const [selectedSorteo, setSelectedSorteo] = useState<string>('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const mes = new Date().toISOString().slice(0, 7); // YYYY-MM

      const [aciertosRes, predRes, resRes] = await Promise.all([
        fetch(`/api/aciertos?tipo=${tipo}&mes=${mes}`),
        fetch(`/api/predicciones?tipo=${tipo}&dias=30`),
        fetch(`/api/resultados?tipo=${tipo}&dias=30`),
      ]);

      const aciertosData = await aciertosRes?.json?.() ?? {};
      const predData = await predRes?.json?.() ?? {};
      const resData = await resRes?.json?.() ?? {};

      if (aciertosData?.success) {
        setAciertos(aciertosData?.data ?? []);
        setStats(aciertosData?.stats ?? { total: 0, zeus: 0, poseidon: 0, apolo: 0 });
      }

      if (predData?.success) {
        setPredicciones(predData?.data?.predicciones ?? []);
      }

      if (resData?.success) {
        setResultados(resData?.data ?? []);
      }
    } catch (error) {
      console.error('Error fetching historial:', error);
    } finally {
      setLoading(false);
    }
  }, [tipo]);

  useEffect(() => {
    if (mounted) {
      fetchData();
    }
  }, [mounted, fetchData]);

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('es-AR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return dateStr ?? '';
    }
  };

  const getDiosIcon = (dios: string) => {
    switch (dios) {
      case 'Zeus':
        return <Zap className="w-4 h-4 text-yellow-400" />;
      case 'Poseidón':
        return <Waves className="w-4 h-4 text-cyan-400" />;
      case 'Apolo':
        return <Music className="w-4 h-4 text-purple-400" />;
      default:
        return null;
    }
  };

  const getDiosColor = (dios: string) => {
    switch (dios) {
      case 'Zeus':
        return 'text-yellow-400 bg-yellow-500/20';
      case 'Poseidón':
        return 'text-cyan-400 bg-cyan-500/20';
      case 'Apolo':
        return 'text-purple-400 bg-purple-500/20';
      default:
        return 'text-gray-400 bg-gray-500/20';
    }
  };

  // Create combined table data
  const tableData = resultados
    ?.filter(r => !selectedSorteo || r?.sorteo === selectedSorteo)
    ?.map(resultado => {
      const fechaBase = resultado?.fecha?.slice?.(0, 10);
      const sorteoPreds = predicciones?.filter(
        p => p?.fecha?.slice?.(0, 10) === fechaBase && p?.sorteo === resultado?.sorteo
      );

      const terminacion = resultado?.primerPremio?.slice?.(-2) ?? '';

      const zeusPred = sorteoPreds?.find(p => p.god.toLowerCase() === 'zeus')?.predictedNumber;
      const poseidonPred = sorteoPreds?.find(p => p.god.toLowerCase() === 'poseidón' || p.god.toLowerCase() === 'poseidon')?.predictedNumber;
      const apoloPred = sorteoPreds?.find(p => p.god.toLowerCase() === 'apolo')?.predictedNumber;

      const zeusHit = terminacion === zeusPred;
      const poseidonHit = terminacion === poseidonPred;
      const apoloHit = terminacion === apoloPred;

      return {
        ...resultado,
        zeusPred,
        poseidonPred,
        apoloPred,
        terminacion,
        zeusHit,
        poseidonHit,
        apoloHit,
        ganador: zeusHit ? 'Zeus' : poseidonHit ? 'Poseidón' : apoloHit ? 'Apolo' : null,
      };
    }) ?? [];

  const sorteos = ['La Previa', 'Primera', 'Matutina', 'Vespertina', 'Nocturna'];

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-gold border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 glass border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Trophy className="w-6 h-6 text-gold" />
            <h1 className="text-xl font-bold font-greek text-white">Historial de Aciertos</h1>
          </div>
          <QuinielaToggle value={tipo} onChange={setTipo} />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-xl p-6 text-center"
          >
            <Trophy className="w-8 h-8 text-gold mx-auto mb-2" />
            <p className="text-3xl font-bold text-gold">{stats?.total ?? 0}</p>
            <p className="text-sm text-gray-400">Aciertos Totales</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass rounded-xl p-6 text-center border-l-4 border-yellow-500"
          >
            <Zap className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
            <p className="text-3xl font-bold text-yellow-400">{stats?.zeus ?? 0}</p>
            <p className="text-sm text-gray-400">Zeus</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass rounded-xl p-6 text-center border-l-4 border-cyan-500"
          >
            <Waves className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
            <p className="text-3xl font-bold text-cyan-400">{stats?.poseidon ?? 0}</p>
            <p className="text-sm text-gray-400">Poseidón</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass rounded-xl p-6 text-center border-l-4 border-purple-500"
          >
            <Music className="w-8 h-8 text-purple-400 mx-auto mb-2" />
            <p className="text-3xl font-bold text-purple-400">{stats?.apolo ?? 0}</p>
            <p className="text-sm text-gray-400">Apolo</p>
          </motion.div>
        </div>

        {/* Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="glass rounded-xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">Distribución de Aciertos</h3>
            <StatsChart stats={stats} type="pie" />
          </div>
          <div className="glass rounded-xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">Aciertos por Dios</h3>
            <StatsChart stats={stats} type="bar" />
          </div>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-4 mb-4">
          <Filter className="w-5 h-5 text-gray-400" />
          <select
            value={selectedSorteo}
            onChange={(e) => setSelectedSorteo(e.target?.value ?? '')}
            className="bg-surface border border-border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-gold"
          >
            <option value="">Todos los sorteos</option>
            {sorteos.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* Table */}
        <div className="glass rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-surface-dark">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Fecha</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Sorteo</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-400">Resultado</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-yellow-400">
                    <div className="flex items-center justify-center gap-1">
                      <Zap className="w-4 h-4" /> Zeus
                    </div>
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-cyan-400">
                    <div className="flex items-center justify-center gap-1">
                      <Waves className="w-4 h-4" /> Poseidón
                    </div>
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-purple-400">
                    <div className="flex items-center justify-center gap-1">
                      <Music className="w-4 h-4" /> Apolo
                    </div>
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gold">Ganador</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-gray-400">
                      <div className="animate-spin w-6 h-6 border-2 border-gold border-t-transparent rounded-full mx-auto" />
                    </td>
                  </tr>
                ) : tableData?.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-gray-400">
                      No hay resultados para mostrar
                    </td>
                  </tr>
                ) : (
                  tableData?.slice?.(0, 50)?.map((row, idx) => (
                    <motion.tr
                      key={row?.id ?? idx}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: idx * 0.02 }}
                      className={`hover:bg-surface-light transition-colors ${row?.ganador ? 'bg-gold/5' : ''}`}
                    >
                      <td className="px-4 py-3 text-sm text-white">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-500" />
                          {formatDate(row?.fecha ?? '')}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-white">{row?.sorteo ?? ''}</td>
                      <td className="px-4 py-3 text-center">
                        <span className="font-mono text-lg font-bold text-electric">
                          {row?.primerPremio ?? '----'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <span className="font-mono text-sm text-gray-300">
                            {row?.zeusPred ?? '--'}
                          </span>
                          {row?.zeusHit && <CheckCircle className="w-4 h-4 text-green-500" />}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <span className="font-mono text-sm text-gray-300">
                            {row?.poseidonPred ?? '--'}
                          </span>
                          {row?.poseidonHit && <CheckCircle className="w-4 h-4 text-green-500" />}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <span className="font-mono text-sm text-gray-300">
                            {row?.apoloPred ?? '--'}
                          </span>
                          {row?.apoloHit && <CheckCircle className="w-4 h-4 text-green-500" />}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        {row?.ganador ? (
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getDiosColor(row?.ganador ?? '')}`}>
                            {getDiosIcon(row?.ganador ?? '')}
                            {row?.ganador}
                          </span>
                        ) : (
                          <XCircle className="w-4 h-4 text-gray-600 mx-auto" />
                        )}
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
