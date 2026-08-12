import { useSyncExternalStore } from "react";
import { subscribeConfirm, getConfirmState, resolveConfirm } from "../utils/confirm";

const AlertIcon = () => (
  <svg viewBox="0 0 24 24" className="h-6 w-6 text-brand-pink" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

export default function ConfirmDialog() {
  const state = useSyncExternalStore(subscribeConfirm, getConfirmState);
  if (!state) return null;

  const { id, title, message, confirmText, cancelText, tone } = state;
  const confirmClass = tone === "danger"
    ? "bg-brand-pink text-white hover:bg-brand-pink-hover"
    : "bg-brand-cocoa-hover text-white hover:bg-brand-cocoa";

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-6" role="alertdialog" aria-modal="true">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => resolveConfirm(id, false)}
      />
      <div className="relative w-full max-w-sm animate-fadeIn rounded-2xl border border-border-pink/40 bg-card-dark p-7 shadow-xl">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-brand-pink/25 bg-brand-pink/10">
          <AlertIcon />
        </div>
        <h3 className="font-display text-xl font-bold text-text-primary">{title}</h3>
        {message && <p className="mt-2 text-sm leading-relaxed text-text-muted">{message}</p>}
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row">
          <button
            onClick={() => resolveConfirm(id, false)}
            className="flex-1 cursor-pointer rounded-xl border border-border-pink/40 bg-bg-dark/70 px-4 py-3 font-display text-sm font-bold text-text-muted transition hover:text-text-primary"
          >
            {cancelText}
          </button>
          <button
            onClick={() => resolveConfirm(id, true)}
            className={`flex-1 cursor-pointer rounded-xl px-4 py-3 font-display text-sm font-bold transition ${confirmClass}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
