import { useState, useEffect } from 'react';
import { SORTEOS_CONFIG } from './types';

export function useNextSorteo() {
    const [nextSorteo, setNextSorteo] = useState<{ nombre: string; hora: string } | null>(null);

    useEffect(() => {
        const calculate = () => {
            const now = new Date();
            const currentMinutes = now.getHours() * 60 + now.getMinutes();

            for (const sorteo of SORTEOS_CONFIG) {
                const [h, m] = sorteo.hora.split(':').map(Number);
                if (h * 60 + m > currentMinutes) {
                    setNextSorteo(sorteo);
                    return;
                }
            }

            setNextSorteo({ nombre: 'La Previa', hora: '10:15' }); // Next day
        };

        calculate();
        const interval = setInterval(calculate, 60000);
        return () => clearInterval(interval);
    }, []);

    return nextSorteo;
}
