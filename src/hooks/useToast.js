import toast from 'react-hot-toast';

// Thin wrapper so components import one hook instead of react-hot-toast directly
const useToast = () => ({
  success: (msg) => toast.success(msg),
  error: (msg) => toast.error(msg),
  loading: (msg) => toast.loading(msg),
  dismiss: (id) => toast.dismiss(id),
});

export default useToast;
