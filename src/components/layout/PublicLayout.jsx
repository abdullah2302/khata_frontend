import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

export default function PublicLayout() {
  const { pathname } = useLocation();
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <div key={pathname} className="animate-rise">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
}
