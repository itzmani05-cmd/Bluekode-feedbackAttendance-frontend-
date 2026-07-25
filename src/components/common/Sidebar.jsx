import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  ClipboardList,
  MessageSquareText,
  X,
  LogOut,
  UserCircle,
} from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import logo from '../../assests/logo.png';

const adminLinks = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/trainers', label: 'Trainers', icon: Users },
  { to: '/admin/students', label: 'Students', icon: GraduationCap },
  { to: '/admin/attendance', label: 'Attendance Reports', icon: ClipboardList },
  { to: '/admin/feedback', label: 'Feedback', icon: MessageSquareText },
];

const trainerLinks = [{ to: '/trainer/dashboard', label: 'Mark Attendance', icon: ClipboardList }];

const Sidebar = ({ role, open, onClose }) => {
  const links = role === 'admin' ? adminLinks : trainerLinks;
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={onClose} aria-hidden="true" />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 transform flex-col bg-primary-900 text-white shadow-2xl transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 lg:shadow-none ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-5 py-5">
          <div className="flex items-center gap-2">
            <img src={logo} alt="Academy logo" className="h-8 w-8 rounded object-contain" />
            <span className="text-lg font-semibold">Academy</span>
          </div>
          <button onClick={onClose} className="lg:hidden">
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="mt-4 flex flex-1 flex-col gap-1 px-3">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive ? 'bg-primary-700 text-white' : 'text-primary-100 hover:bg-primary-800'
                }`
              }
            >
              <Icon className="h-5 w-5" />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-primary-800 px-3 py-4">
          <div className="mb-2 flex items-center gap-2 px-3 text-sm text-primary-100">
            <UserCircle className="h-5 w-5 text-primary-300" />
            <span className="truncate font-medium">{user?.name}</span>
          </div>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-primary-100 transition-colors hover:bg-primary-800"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
