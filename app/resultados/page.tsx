import { Sidebar } from '@/components/ui/sidebar';
import { ResultadosClient } from './resultados-client';

export default function ResultadosPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 ml-64">
        <ResultadosClient />
      </main>
    </div>
  );
}
