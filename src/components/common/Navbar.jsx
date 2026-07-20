import { Menu, LogOut, UserCircle, School } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-3 sm:px-6">
      <div className="flex items-center gap-2">
        <button onClick={onMenuClick} className="rounded-md p-2 text-gray-500 hover:bg-gray-100 lg:hidden">
          <Menu className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-2 lg:hidden">
          <School className="h-5 w-5 text-primary-600" />
          <span className="text-sm font-semibold text-gray-800">Academy</span>
        </div>
        <h1 className="hidden text-lg font-semibold text-gray-800 lg:block">
          {user?.role === 'admin' ? 'Admin Console' : 'Trainer Console'}
        </h1>
      </div>
      <div className="flex items-center gap-3">
        <div className="hidden items-center gap-2 text-sm text-gray-600 sm:flex">
          <UserCircle className="h-5 w-5 text-gray-400" />
          <span className="font-medium">{user?.name}</span>
        </div>
        <button onClick={handleLogout} className="btn-secondary !px-3 !py-1.5 text-xs">
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </header>
  );
};

export default Navbar;
