import { useSyncExternalStore } from "react";
import { subscribeToasts, getToasts, dismiss } from "../utils/toast";

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0 text-green-400" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6L9 17l-5-5" />
  </svg>
);

const XIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0 text-red-400" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
);

const InfoIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0 text-accent-cocoa-light" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
);

const typeStyles = {
  success: { border: "border-green-500/40", icon: <CheckIcon /> },
  error: { border: "border-red-500/40", icon: <XIcon /> },
  info: { border: "border-brand-cocoa/40", icon: <InfoIcon /> },
};

function ToastItem({ toast: t }) {
  const { border, icon } = typeStyles[t.type] || typeStyles.info;
  return (
    <div className={`animate-fadeIn flex items-start gap-3 rounded-xl border ${border} bg-card-dark px-4 py-3 shadow-lg backdrop-blur`}>
      {icon}
      <p className="min-w-0 flex-1 text-sm font-medium leading-snug text-text-primary">{t.message}</p>
      <button
        onClick={() => dismiss(t.id)}
        className="shrink-0 cursor-pointer text-text-muted transition hover:text-text-primary"
        aria-label="Dismiss notification"
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

export default function ToastContainer() {
  const toasts = useSyncExternalStore(subscribeToasts, getToasts);

  return (
    <div className="fixed right-5 top-5 z-[200] flex w-full max-w-sm flex-col gap-2.5" role="status" aria-live="polite">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} />
      ))}
    </div>
  );
}
