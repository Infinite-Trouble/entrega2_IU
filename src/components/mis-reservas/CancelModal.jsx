import React, { useEffect, useRef } from 'react';

export default function CancelModal({ isOpen, onClose, onConfirm }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      if (!dialog.open) {
        dialog.showModal();
      }
    } else {
      if (dialog.open) {
        dialog.close();
      }
    }
  }, [isOpen]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleCancel = (e) => {
      e.preventDefault();
      onClose();
    };

    dialog.addEventListener('cancel', handleCancel);
    return () => dialog.removeEventListener('cancel', handleCancel);
  }, [onClose]);

  return (
    <dialog ref={dialogRef} id="cancelDialog" aria-labelledby="cancelDlgTitle">
      <div className="dialog-inner">
        <h2 id="cancelDlgTitle">Anular reserva</h2>
        <p id="cancelDlgBody">
          ¿Estás seguro de que deseas anular esta reserva? Podrás volver a
          generarla desde &quot;Reserva de menú&quot;.
        </p>
        <div className="dialog-actions">
          <button
            className="btn-secondary"
            id="cancelDlgCancel"
            type="button"
            onClick={onClose}
          >
            Mantener
          </button>
          <button
            className="btn-danger"
            id="cancelDlgOk"
            type="button"
            onClick={onConfirm}
          >
            Sí, anular
          </button>
        </div>
      </div>
    </dialog>
  );
}
