const listeners = new Set();
let toasts = [];
let nextId = 0;

const DURATION = 4500;

const emit = () => {
  listeners.forEach((listener) => listener(toasts));
};

const push = (type, message) => {
  const id = ++nextId;
  toasts = [...toasts, { id, type, message }];
  emit();
  window.setTimeout(() => dismiss(id), DURATION);
};

export const dismiss = (id) => {
  toasts = toasts.filter((t) => t.id !== id);
  emit();
};

export const toast = {
  success(message) {
    push("success", message);
  },
  error(message) {
    push("error", message);
  },
  info(message) {
    push("info", message);
  },
};

export const subscribeToasts = (listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export const getToasts = () => toasts;
