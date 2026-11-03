import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ThemePicker from '../ui/ThemePicker';

export default function TopBar({ onSearch }) {
  const { user } = useAuth();
  return (
    <div className="mx-auto mb-3 flex max-w-7xl items-center justify-between gap-3 print:hidden">
      <button
        onClick={onSearch}
        className="flex max-w-sm flex-1 cursor-pointer items-center gap-2.5 rounded-md border border-rule bg-paper/70 px-3.5 py-2 text-left text-muted transition-colors hover:bg-paper md:w-72 md:flex-none"
      >
        <i className="fa-solid fa-magnifying-glass" />
        <span className="flex-1">Search anything</span>
        <kbd className="hidden rounded border border-rule px-1.5 text-xs md:inline">Ctrl K</kbd>
      </button>
      <div className="flex items-center gap-4">
        <ThemePicker compact />
        <Link to="/settings" title="Settings" className="grid size-9 place-items-center rounded-full bg-ink font-semibold text-white">
          {user.name[0].toUpperCase()}
        </Link>
      </div>
    </div>
  );
}
