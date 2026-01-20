import { Sidebar } from '@/components/ui/sidebar';
import { HistorialClient } from './historial-client';

export default function HistorialPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 ml-64">
        <HistorialClient />
      </main>
    </div>
  );
}
