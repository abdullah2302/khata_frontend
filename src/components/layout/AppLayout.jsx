import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import CommandPalette from './CommandPalette';
import Sheet from '../ui/Sheet';

export default function AppLayout() {
  const { pathname } = useLocation();
  const [searchOpen, setSearchOpen] = useState(false);

  // Ctrl+K (or Cmd+K) toggles the quick search
  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen((o) => !o);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div className="min-h-screen md:grid md:grid-cols-[13rem_1fr]">
      <Sidebar />
      <main className="min-w-0 p-2.5 pb-20 md:p-7 print:col-span-full print:p-0">
        <TopBar onSearch={() => setSearchOpen(true)} />
        <Sheet className="max-w-7xl">
          <div key={pathname} className="animate-rise">
            <Outlet />
          </div>
        </Sheet>
      </main>
      {searchOpen && <CommandPalette onClose={() => setSearchOpen(false)} />}
    </div>
  );
}
