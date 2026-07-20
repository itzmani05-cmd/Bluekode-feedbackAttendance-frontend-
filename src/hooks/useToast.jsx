import toast from 'react-hot-toast';
import { CheckCircle2, XCircle, Loader2, X } from 'lucide-react';

const config = {
  success: { icon: CheckCircle2, iconClass: 'text-green-500', barClass: 'bg-green-500' },
  error: { icon: XCircle, iconClass: 'text-red-500', barClass: 'bg-red-500' },
  loading: { icon: Loader2, iconClass: 'text-primary-500 animate-spin', barClass: 'bg-primary-500' },
};

const ToastCard = ({ t, type, message }) => {
  const { icon: Icon, iconClass, barClass } = config[type];
  return (
    <div
      className={`relative flex w-full max-w-sm items-start gap-3 overflow-hidden rounded-xl border border-gray-100 bg-white py-3 pl-4 pr-3 shadow-lg ring-1 ring-black/5 ${
        t.visible ? 'animate-enter' : 'animate-leave'
      }`}
    >
      <span className={`absolute inset-y-0 left-0 w-1 ${barClass}`} />
      <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${iconClass}`} />
      <p className="flex-1 pt-0.5 text-sm font-medium leading-snug text-gray-800">{message}</p>
      {type !== 'loading' && (
        <button
          onClick={() => toast.dismiss(t.id)}
          className="mt-0.5 shrink-0 rounded-md p-0.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

const useToast = () => ({
  success: (msg) => toast.custom((t) => <ToastCard t={t} type="success" message={msg} />, { duration: 3500 }),
  error: (msg) => toast.custom((t) => <ToastCard t={t} type="error" message={msg} />, { duration: 5000 }),
  loading: (msg) => toast.custom((t) => <ToastCard t={t} type="loading" message={msg} />, { duration: Infinity }),
  dismiss: (id) => toast.dismiss(id),
});

export default useToast;
