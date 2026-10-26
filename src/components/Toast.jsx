import React from 'react';

export default function Toast({ toast, onClose }) {
  if (!toast.visible) return null;

  return (
    <div
      className={`toast toast-${toast.variant} show`}
      role="status"
      aria-live="polite"
    >
      <span>{toast.message}</span>
      <button
        className="toast-close"
        onClick={onClose}
        aria-label="Cerrar notificación"
      >
        ×
      </button>
    </div>
  );
}
