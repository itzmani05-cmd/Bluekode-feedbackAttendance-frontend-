import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, GraduationCap } from 'lucide-react';
import useAuth from '../hooks/useAuth';
import useToast from '../hooks/useToast';
import logo from '../assests/logo.png';

const Login = () => {
  const [role, setRole] = useState('admin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginAsAdmin, loginAsTrainer } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = role === 'admin' ? await loginAsAdmin(email, password) : await loginAsTrainer(email, password);
      toast.success(`Welcome back, ${user.name}`);
      navigate(role === 'admin' ? '/admin/dashboard' : '/trainer/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary-900 to-primary-700 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl sm:p-8">
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-600 text-white">
            <img src={logo} alt="Academy logo" className="h-8 w-8 rounded object-contain" />
          </div>
          <h1 className="text-xl font-semibold text-gray-900">Academy Attendance</h1>
          <p className="mt-1 text-sm text-gray-500">Sign in to continue</p>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-2 rounded-lg bg-gray-100 p-1">
          <button
            type="button"
            onClick={() => setRole('admin')}
            className={`flex items-center justify-center gap-1.5 rounded-md py-2 text-sm font-medium transition-colors ${
              role === 'admin' ? 'bg-white shadow text-primary-700' : 'text-gray-500'
            }`}
          >
            <ShieldCheck className="h-4 w-4" /> Admin
          </button>
          <button
            type="button"
            onClick={() => setRole('trainer')}
            className={`flex items-center justify-center gap-1.5 rounded-md py-2 text-sm font-medium transition-colors ${
              role === 'trainer' ? 'bg-white shadow text-primary-700' : 'text-gray-500'
            }`}
          >
            <GraduationCap className="h-4 w-4" /> Trainer
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label-text">Email</label>
            <input
              type="email"
              required
              className="input-field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@academy.com"
            />
          </div>
          <div>
            <label className="label-text">Password</label>
            <input
              type="password"
              required
              className="input-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
