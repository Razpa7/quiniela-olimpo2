'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { History, Calendar, RefreshCw } from 'lucide-react';
import { QuinielaToggle } from '@/components/ui/quiniela-toggle';

interface Resultado {
  id: string;
  fecha: string;
  sorteo: string;
  tipoQuiniela: string;
  primerPremio: string;
}

export function ResultadosClient() {
  const [tipo, setTipo] = useState<'Nacional' | 'Provincial'>('Provincial');
  const [resultados, setResultados] = useState<Resultado[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/resultados?tipo=${tipo}&dias=30`);
      const data = await res?.json?.() ?? {};
      
      if (data?.success) {
        setResultados(data?.data ?? []);
      }
    } catch (error) {
      console.error('Error fetching resultados:', error);
    } finally {
      setLoading(false);
    }
  }, [tipo]);

  const syncResults = async () => {
    try {
      setSyncing(true);
      await fetch('/api/sync', { method: 'POST' });
      await fetchData();
    } catch (error) {
      console.error('Sync error:', error);
    } finally {
      setSyncing(false);
    }
  };

  useEffect(() => {
    if (mounted) {
      fetchData();
    }
  }, [mounted, fetchData]);

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('es-AR', { 
        weekday: 'short',
        day: '2-digit', 
        month: 'short',
        year: 'numeric' 
      });
    } catch {
      return dateStr ?? '';
    }
  };

  // Group by date
  const groupedResults = (resultados ?? []).reduce((acc, r) => {
    const fecha = r?.fecha?.slice?.(0, 10) ?? '';
    if (!acc[fecha]) acc[fecha] = [];
    acc[fecha]?.push?.(r);
    return acc;
  }, {} as Record<string, Resultado[]>);

  const sortOrder = ['La Previa', 'Primera', 'Matutina', 'Vespertina', 'Nocturna'];

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
            <History className="w-6 h-6 text-electric" />
            <h1 className="text-xl font-bold font-greek text-white">Resultados Históricos</h1>
          </div>
          <div className="flex items-center gap-4">
            <QuinielaToggle value={tipo} onChange={setTipo} />
            <button
              onClick={syncResults}
              disabled={syncing}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-electric/20 to-gold/20 border border-electric/50 rounded-xl text-electric hover:from-electric/30 hover:to-gold/30 transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Actualizar</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin w-8 h-8 border-4 border-gold border-t-transparent rounded-full" />
          </div>
        ) : Object.keys(groupedResults ?? {}).length === 0 ? (
          <div className="text-center py-20">
            <History className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No hay resultados para mostrar</p>
            <p className="text-sm text-gray-500 mt-2">Sincroniza para obtener los últimos resultados</p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedResults ?? {})
              ?.sort?.(([a], [b]) => new Date(b ?? 0).getTime() - new Date(a ?? 0).getTime())
              ?.map?.(([fecha, results], idx) => (
                <motion.div
                  key={fecha ?? idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="glass rounded-xl overflow-hidden"
                >
                  <div className="bg-gradient-to-r from-gold/10 to-electric/10 px-6 py-3 border-b border-border">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gold" />
                      <span className="font-medium text-white">{formatDate(fecha ?? '')}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-5 divide-x divide-border">
                    {sortOrder.map(sorteo => {
                      const result = results?.find?.(r => r?.sorteo === sorteo);
                      return (
                        <div key={sorteo} className="p-4 text-center">
                          <p className="text-xs text-gray-500 mb-1">{sorteo}</p>
                          {result?.primerPremio ? (
                            <p className="text-xl font-bold font-mono text-electric">
                              {result?.primerPremio ?? '----'}
                            </p>
                          ) : (
                            <p className="text-xl font-mono text-gray-600">----</p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              ))}
          </div>
        )}
      </main>
    </div>
  );
}
