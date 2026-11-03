import { createContext, useCallback, useContext, useMemo, useState } from 'react';

const ToastContext = createContext();
export const useToast = () => useContext(ToastContext);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => setToasts((t) => t.filter((x) => x.id !== id)), []);
  const push = useCallback(
    (type, message) => {
      const id = Date.now() + Math.random();
      setToasts((t) => [...t, { id, type, message }]);
      setTimeout(() => dismiss(id), 3500);
    },
    [dismiss]
  );
  const toast = useMemo(() => ({ success: (m) => push('success', m), error: (m) => push('error', m) }), [push]);

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="pointer-events-none fixed right-4 bottom-20 z-50 grid gap-2 md:bottom-6 print:hidden" aria-live="polite">
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className={`pointer-events-auto flex animate-slide-in items-center gap-3 rounded-md px-4 py-3 text-white shadow-lg ${
              t.type === 'error' ? 'bg-margin' : 'bg-ink'
            }`}
          >
            <i className={`fa-solid ${t.type === 'error' ? 'fa-circle-exclamation' : 'fa-circle-check text-gold'}`} />
            <span>{t.message}</span>
            <button onClick={() => dismiss(t.id)} aria-label="Dismiss" className="ml-1 cursor-pointer opacity-70 hover:opacity-100">
              <i className="fa-solid fa-xmark" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
