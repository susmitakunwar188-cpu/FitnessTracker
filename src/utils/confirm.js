const listeners = new Set();
let state = null;
const resolvers = new Map();
let nextId = 0;

const emit = () => {
  listeners.forEach((listener) => listener(state));
};

export const confirmDialog = (options) => {
  const {
    title = 'Are you sure?',
    message = '',
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    tone = 'danger'
  } = options || {};
  return new Promise((resolve) => {
    const id = ++nextId;
    state = { id, title, message, confirmText, cancelText, tone };
    resolvers.set(id, resolve);
    emit();
  });
};

export const resolveConfirm = (id, result) => {
  const resolve = resolvers.get(id);
  if (!resolve) return;
  resolvers.delete(id);
  state = null;
  emit();
  resolve(result);
};

export const getConfirmState = () => state;

export const subscribeConfirm = (listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};
