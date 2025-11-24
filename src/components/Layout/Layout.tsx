import { Outlet } from 'react-router';
import { useSidebar } from '../../contexts/SidebarContext';
import { Sidebar } from './Sidebar';
import { Menu } from 'lucide-react';

export function Layout() {
  const { toggle } = useSidebar();

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-white to-gray-300">
      <Sidebar />
      <div className="sticky top-0 left-0 flex-1 lg:ml-0">
        {/* Bouton menu mobile */}
        <div className="lg:hidden bg-white shadow-sm border-b border-gray-200 px-4 py-3">
          <button
            onClick={toggle}
            className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-blue-600 transition-colors"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
        
        <main className="p-2 md:p-4 lg:p-8 overflow-y-auto max-h-[100dvh] overflow-auto border-l-1 border-purple-400 border-outset">
          <Outlet />
        </main>
      </div>
    </div>
  );
}