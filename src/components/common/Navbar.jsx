import { Menu } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import logo from '../../assests/logo.png';

const Navbar = ({ onMenuClick }) => {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-3 sm:px-6">
      <div className="flex items-center gap-2">
        <button onClick={onMenuClick} className="rounded-md p-2 text-gray-500 hover:bg-gray-100 lg:hidden">
          <Menu className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-2 lg:hidden">
          <img src={logo} alt="Academy logo" className="h-6 w-6 rounded object-contain" />
          <span className="text-sm font-semibold text-gray-800">Academy</span>
        </div>
        <h1 className="hidden text-lg font-semibold text-gray-800 lg:block">
          {user?.role === 'admin' ? 'Admin Console' : 'Trainer Console'}
        </h1>
      </div>
      <div className="flex items-center gap-3 sm:hidden">
        <span className="text-sm font-medium text-gray-600">{user?.name}</span>
      </div>
    </header>
  );
};

export default Navbar;
