"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type AlertType = "success" | "warning" | "error" | "info";

type AlertState = {
  isOpen: boolean;
  type: AlertType;
  title: string;
  subtitle: string;
  duration: number;
};

type AlertContextValue = {
  showMessage: (type: AlertType, title: string, subtitle: string, duration?: number) => void;
  hideMessage: () => void;
};

const AlertContext = createContext<AlertContextValue | undefined>(undefined);

const alertStyles: Record<
  AlertType,
  {
    accent: string;
    iconBg: string;
    iconText: string;
    icon: string;
  }
> = {
  success: {
    accent: "from-emerald-500 to-green-500",
    iconBg: "bg-emerald-50",
    iconText: "text-emerald-600",
    icon: "✓",
  },
  warning: {
    accent: "from-amber-500 to-orange-500",
    iconBg: "bg-amber-50",
    iconText: "text-amber-600",
    icon: "!",
  },
  error: {
    accent: "from-rose-500 to-red-500",
    iconBg: "bg-rose-50",
    iconText: "text-rose-600",
    icon: "✕",
  },
  info: {
    accent: "from-sky-500 to-cyan-500",
    iconBg: "bg-sky-50",
    iconText: "text-sky-600",
    icon: "i",
  },
};

const AlertPopup = ({ alert, onClose }: { alert: AlertState; onClose: () => void }) => {
  if (!alert.isOpen) {
    return null;
  }

  const style = alertStyles[alert.type];

  return (
    <div className="fixed inset-0 z-[9999] flex items-start justify-center px-4 pt-6 sm:pt-10">
      <div className="pointer-events-auto w-full max-w-md overflow-hidden rounded-[28px] border border-slate-200/80 bg-white/95 shadow-[0_25px_80px_-24px_rgba(15,23,42,0.35)] backdrop-blur-xl">
        <div className={`h-1.5 w-full bg-gradient-to-r ${style.accent}`} />
        <div className="p-5 sm:p-6">
          <div className="flex items-start gap-3">
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${style.iconBg}`}
            >
              <span className={`text-xl font-semibold ${style.iconText}`}>{style.icon}</span>
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">{alert.title}</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-600">{alert.subtitle}</p>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-full p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                  aria-label="Close alert"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const AlertProvider = ({ children }: { children: ReactNode }) => {
  const [alert, setAlert] = useState<AlertState>({
    isOpen: false,
    type: "info",
    title: "",
    subtitle: "",
    duration: 4000,
  });

  const hideMessage = useCallback(() => {
    setAlert((prev) => ({ ...prev, isOpen: false }));
  }, []);

  const showMessage = useCallback(
    (type: AlertType, title: string, subtitle: string, duration = 4000) => {
      setAlert({ isOpen: true, type, title, subtitle, duration });
    },
    []
  );

  useEffect(() => {
    if (!alert.isOpen) {
      return;
    }

    const timer = window.setTimeout(() => hideMessage(), alert.duration);
    return () => window.clearTimeout(timer);
  }, [alert.duration, alert.isOpen, hideMessage]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.showMessage = (type, title, subtitle, duration) => {
      showMessage(type, title, subtitle, duration);
    };

    return () => {
      delete window.showMessage;
    };
  }, [showMessage]);

  const value = useMemo(
    () => ({
      showMessage,
      hideMessage,
    }),
    [showMessage, hideMessage]
  );

  return (
    <AlertContext.Provider value={value}>
      {children}
      <AlertPopup alert={alert} onClose={hideMessage} />
    </AlertContext.Provider>
  );
};

export const useAlert = () => {
  const context = useContext(AlertContext);

  if (!context) {
    throw new Error("useAlert must be used inside an AlertProvider");
  }

  return context;
};

declare global {
  interface Window {
    showMessage?: (type: AlertType, title: string, subtitle: string, duration?: number) => void;
  }
}

export default AlertPopup;
