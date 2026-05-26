import React from 'react';
import { X, CheckCircle, AlertTriangle, Info } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Toast = () => {
  const { toasts } = useCart();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 w-full max-w-[90%] sm:max-w-md pointer-events-none">
      {toasts.map((toast) => {
        let icon = <CheckCircle className="w-5 h-5 text-restaurant-gold" />;
        let borderClass = 'border-restaurant-gold/30';
        let bgClass = 'bg-[#121214]/95';

        if (toast.type === 'warning') {
          icon = <AlertTriangle className="w-5 h-5 text-red-500" />;
          borderClass = 'border-red-500/30';
        } else if (toast.type === 'info') {
          icon = <Info className="w-5 h-5 text-sky-400" />;
          borderClass = 'border-sky-400/30';
        }

        return (
          <div
            key={toast.id}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${borderClass} ${bgClass} shadow-xl animate-slide-up pointer-events-auto backdrop-blur-md`}
          >
            {icon}
            <span className="text-sm font-medium text-restaurant-text-primary">
              {toast.message}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default Toast;
