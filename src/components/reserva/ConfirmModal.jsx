import React, { useEffect, useRef } from 'react';
import { formatLongDate } from '../../utils/dateUtils';

export default function ConfirmModal({
  isOpen,
  items,
  onClose,
  onConfirm,
  isSubmitting,
}) {
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

  if (!isOpen && (!dialogRef.current || !dialogRef.current.open)) {
    // keep rendered for animation or let ref handle
  }

  const { newItems = [], changeItems = [] } = items || {};

  return (
    <dialog
      ref={dialogRef}
      id="confirmDialog"
      aria-labelledby="confirmDlgTitle"
    >
      <div className="dialog-inner">
        <h2 id="confirmDlgTitle">Confirmar reservas</h2>
        <p>
          Revisa el resumen antes de confirmar. Esta acción generará o
          actualizará tus reservas.
        </p>

        <ul className="dialog-list" id="confirmList">
          {newItems.map((d) => {
            const isVeg = d.special === 'vegetariano';
            return (
              <li key={`new-${d.id}`}>
                <span>
                  <strong>Nueva:</strong> {d.name} {d.num} —{' '}
                  {formatLongDate(d.dateStr)}
                </span>
                <span className={`tag ${isVeg ? 'tag-veg' : 'tag-hipo'}`}>
                  {isVeg ? 'Vegetariano' : 'Hipocalórico'}
                </span>
              </li>
            );
          })}

          {changeItems.map((d) => {
            const isVeg = d.special === 'vegetariano';
            const prev =
              d.reserved === 'vegetariano' ? 'Vegetariano' : 'Hipocalórico';
            return (
              <li key={`change-${d.id}`}>
                <span>
                  <strong>Cambio:</strong> {d.name} {d.num} — {prev} →
                </span>
                <span className={`tag ${isVeg ? 'tag-veg' : 'tag-hipo'}`}>
                  {isVeg ? 'Vegetariano' : 'Hipocalórico'}
                </span>
              </li>
            );
          })}
        </ul>

        <div className="dialog-actions">
          <button
            className="btn-secondary"
            id="confirmDlgCancel"
            type="button"
            disabled={isSubmitting}
            onClick={onClose}
          >
            Volver
          </button>
          <button
            className="confirm-btn"
            id="confirmDlgOk"
            type="button"
            disabled={isSubmitting}
            onClick={onConfirm}
          >
            <span className="btn-label">
              {isSubmitting ? 'Procesando…' : 'Sí, confirmar'}
            </span>
            {isSubmitting && (
              <span className="spinner" aria-hidden="true"></span>
            )}
          </button>
        </div>
      </div>
    </dialog>
  );
}
