import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  ClipboardList,
  MessageSquareText,
  X,
  LogOut,
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

const getInitials = (name = '') =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || '?';

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
        <div className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm lg:hidden" onClick={onClose} aria-hidden="true" />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex h-full w-64 transform flex-col bg-slate-900 text-slate-100 shadow-2xl transition-transform duration-200 ease-in-out lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 lg:shadow-none ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between gap-2 border-b border-white/5 px-5 py-5">
          <div className="flex min-w-0 items-center gap-2.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white">
              <img src={logo} alt="Academy logo" className="h-6 w-6 rounded object-contain bg-cover" />
            </div>
            <div className="min-w-0 leading-tight">
              <p className="truncate text-sm font-semibold tracking-wide text-white">Bluekode Academy</p>
              <p className="truncate text-[11px] font-medium uppercase tracking-wider text-slate-400">
                Attendance Portal
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-slate-400 transition-colors hover:bg-white/10 hover:text-white lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-5">
          <p className="mb-1 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">Menu</p>
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                `group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary-600/15 text-white'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={`absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r bg-primary-500 transition-opacity ${
                      isActive ? 'opacity-100' : 'opacity-0'
                    }`}
                  />
                  <Icon className={`h-[18px] w-[18px] shrink-0 ${isActive ? 'text-primary-400' : 'text-slate-400 group-hover:text-white'}`} />
                  <span className="truncate">{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-white/5 p-3">
          <div className="mb-2 flex items-center gap-2.5 rounded-lg px-2 py-2">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-600/20 text-xs font-semibold text-primary-300 ring-1 ring-white/10">
              {getInitials(user?.name)}
            </div>
            <div className="min-w-0 leading-tight">
              <p className="truncate text-sm font-medium text-white">{user?.name}</p>
              <p className="truncate text-xs capitalize text-slate-400">{role}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-300 transition-colors hover:bg-red-500/10 hover:text-red-400"
          >
            <LogOut className="h-[18px] w-[18px]" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
