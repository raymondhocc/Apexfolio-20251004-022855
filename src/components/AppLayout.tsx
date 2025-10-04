import { Outlet } from 'react-router-dom';
import { Sidebar } from '@/components/Sidebar';
import { Toaster } from '@/components/ui/sonner';
export function AppLayout() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Sidebar />
      <main className="pl-16 md:pl-52 transition-all duration-200">
        <div className="max-w-7xl mx-auto p-6 md:p-8">
          <Outlet />
        </div>
      </main>
      <Toaster richColors />
    </div>
  );
}