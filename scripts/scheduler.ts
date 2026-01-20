
import cron from 'node-cron';
import fetch from 'node-fetch';

const API_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
const CRON_SECRET = process.env.CRON_SECRET || 'cron-secret-123';

console.log('🚀 Iniciando Scheduler de Quiniela Olimpo...');
console.log(`📡 Conectando a: ${API_URL}`);

// Función auxiliar para llamar al endpoint de sync
async function triggerSync(source: string) {
  console.log(`⏰ [${new Date().toISOString()}] Ejecutando sync: ${source}`);
  try {
    const response = await fetch(`${API_URL}/api/sync`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': CRON_SECRET,
      },
    });

    if (response.ok) {
      const data = await response.json();
      console.log(`✅ Sync exitoso (${source}):`, JSON.stringify(data));
    } else {
      console.error(`❌ Error en sync (${source}): ${response.status} ${response.statusText}`);
      const text = await response.text();
      console.error('Response:', text);
    }
  } catch (error) {
    console.error(`🔥 Excepción en sync (${source}):`, error);
  }
}

// Cron Jobs según horarios solicitados:
// 10:15: La Previa
cron.schedule('15 10 * * *', () => triggerSync('La Previa'), {
  timezone: "America/Argentina/Buenos_Aires"
});

// 11:30: Primera
cron.schedule('30 11 * * *', () => triggerSync('Primera'), {
  timezone: "America/Argentina/Buenos_Aires"
});

// 14:00: Matutina
cron.schedule('0 14 * * *', () => triggerSync('Matutina'), {
  timezone: "America/Argentina/Buenos_Aires"
});

// 17:30: Vespertina
cron.schedule('30 17 * * *', () => triggerSync('Vespertina'), {
  timezone: "America/Argentina/Buenos_Aires"
});

// 21:00: Nocturna
cron.schedule('0 21 * * *', () => triggerSync('Nocturna'), {
  timezone: "America/Argentina/Buenos_Aires"
});

console.log('✅ Scheduler configurado correctamente. Esperando horarios...');

// Test inmediato al iniciar (opcional, para verificar que funcione)
// triggerSync('Startup Test');
