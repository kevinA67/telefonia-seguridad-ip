import { useToast } from '../../contexts/ToastContext';
import { CheckCircle, AlertTriangle, XCircle, Info, X } from 'lucide-react';

const icons = {
  success: CheckCircle,
  warning: AlertTriangle,
  error: XCircle,
  info: Info,
};

const colors = {
  success: 'bg-emerald-50 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200',
  warning: 'bg-amber-50 dark:bg-amber-900/30 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200',
  error: 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200',
  info: 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200',
};

export function ToastContainer() {
  const { toasts, removeToast } = useToast();
  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 w-80">
      {toasts.map(toast => {
        const Icon = icons[toast.tipo];
        return (
          <div key={toast.id} className={`flex items-start gap-3 p-4 rounded-xl border shadow-lg animate-slide-in ${colors[toast.tipo]}`}>
            <Icon className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <p className="text-sm font-medium flex-1">{toast.mensaje}</p>
            <button onClick={() => removeToast(toast.id)} className="flex-shrink-0 p-0.5 rounded hover:bg-black/10">
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
