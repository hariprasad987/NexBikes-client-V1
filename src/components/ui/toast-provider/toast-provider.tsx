"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

import styles from "./toast-provider.module.scss";

export type ToastTone = "error" | "success" | "info";

export type ToastOptions = {
  duration?: number;
  message: string;
  tone?: ToastTone;
};

type Toast = Omit<ToastOptions, "tone"> & { id: number; tone: ToastTone };

type ToastContextValue = {
  dismissToast: (id: number) => void;
  showToast: (options: ToastOptions) => number;
};

const toneClasses: Record<ToastTone, string> = {
  error: styles.error,
  info: styles.info,
  success: styles.success,
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismissToast = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    ({ duration = 5000, message, tone = "info" }: ToastOptions) => {
      const id = Date.now() + Math.random();
      setToasts((current) => [...current, { duration, id, message, tone }]);
      return id;
    },
    [],
  );

  const value = useMemo(() => ({ dismissToast, showToast }), [dismissToast, showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div aria-live="polite" className={styles.viewport} role="status">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} onDismiss={() => dismissToast(toast.id)} toast={toast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({ onDismiss, toast }: { onDismiss: () => void; toast: Toast }) {
  useEffect(() => {
    const timeout = window.setTimeout(onDismiss, toast.duration);
    return () => window.clearTimeout(timeout);
  }, [onDismiss, toast.duration]);

  return (
    <div className={`${styles.toast} ${toneClasses[toast.tone]}`} role={toast.tone === "error" ? "alert" : "status"}>
      <div className={styles.content}>
        <p>{toast.message}</p>
        <button aria-label="Dismiss notification" className={styles.dismiss} onClick={onDismiss} type="button">
          ×
        </button>
      </div>
      <span aria-hidden="true" className={styles.progress} style={{ animationDuration: `${toast.duration}ms` }} />
    </div>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used inside ToastProvider");
  }

  return context;
}
