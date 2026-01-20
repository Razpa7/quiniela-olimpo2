import { Sidebar } from '@/components/ui/sidebar';
import { DashboardClient } from '@/components/dashboard-client';

export default function HomePage() {
  return (
    <div className="flex min-h-screen bg-background">
      <div className="hidden md:block">
        <Sidebar />
      </div>
      <main className="flex-1 md:ml-64 pb-20 md:pb-0"> {/* Adjusted for mobile bottom nav */}
        <DashboardClient />
      </main>
    </div>
  );
}
