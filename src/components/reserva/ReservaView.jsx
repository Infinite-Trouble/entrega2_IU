import React, { useState } from 'react';
import WeekSection from './WeekSection';
import ConfirmModal from './ConfirmModal';
import { isPast } from '../../utils/dateUtils';

export default function ReservaView({
  weeks,
  onToggleMenu,
  onToggleExpand,
  onChangeTab,
  onWeekAction,
  onClearSelection,
  onConfirmReservations,
}) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Compute pending summary
  const newItems = [];
  const changeItems = [];

  weeks.forEach((w) => {
    w.days.forEach((d) => {
      if (isPast(d.dateStr)) return;
      if (!d.special) return;
      if (d.reserved && d.special !== d.reserved) {
        changeItems.push(d);
      } else if (!d.reserved) {
        newItems.push(d);
      }
    });
  });

  const total = newItems.length + changeItems.length;

  const parts = [];
  if (newItems.length > 0) {
    parts.push(
      `${newItems.length} nueva${newItems.length !== 1 ? 's' : ''}`
    );
  }
  if (changeItems.length > 0) {
    parts.push(
      `${changeItems.length} cambio${changeItems.length !== 1 ? 's' : ''}`
    );
  }
  const countBreakText = parts.length ? `(${parts.join(', ')})` : '';

  const handleOpenConfirm = () => {
    if (total === 0) return;
    setIsConfirmOpen(true);
  };

  const handleCloseConfirm = () => {
    if (isSubmitting) return;
    setIsConfirmOpen(false);
  };

  const handleConfirm = async () => {
    setIsSubmitting(true);
    await onConfirmReservations(newItems, changeItems);
    setIsSubmitting(false);
    setIsConfirmOpen(false);
  };

  return (
    <section id="view-reserva" className="view active" aria-labelledby="h-reserva">
      <header className="page-head">
        <h1 id="h-reserva">Reserva de menú</h1>
        <p className="campus">Casa Central Valparaíso</p>
        <p className="lede">
          Elige tus días de menú vegetariano o hipocalórico consultando el
          detalle de platos y macronutrientes. Selecciona un menú especial para
          reservarlo; vuelve a presionar para retornar al general. Solo se
          permite reservar dentro del período actual de 2 semanas.
        </p>
      </header>

      <div className="legend" role="note" aria-label="Leyenda de estados">
        <span className="legend-item">
          <i className="dot dot-general" aria-hidden="true"></i>Menú general
          (predeterminado)
        </span>
        <span className="legend-item">
          <i className="dot dot-veg" aria-hidden="true"></i>Vegetariano
          reservado
        </span>
        <span className="legend-item">
          <i className="dot dot-hipo" aria-hidden="true"></i>Hipocalórico
          reservado
        </span>
        <span className="legend-item">
          <i className="dot dot-past" aria-hidden="true"></i>Día no disponible
        </span>
      </div>

      <main id="calendar" aria-live="polite">
        {weeks.map((week) => (
          <WeekSection
            key={week.label}
            week={week}
            onToggleMenu={onToggleMenu}
            onToggleExpand={onToggleExpand}
            onChangeTab={onChangeTab}
            onWeekAction={onWeekAction}
          />
        ))}
      </main>

      <div className="summary-bar" role="region" aria-label="Resumen de selección">
        <p className="summary-text">
          <strong id="countNum">{total}</strong> días con cambios pendientes{' '}
          <span id="countBreak">{countBreakText}</span>
        </p>
        <button
          id="clearBtn"
          className="btn-ghost"
          disabled={total === 0}
          onClick={onClearSelection}
        >
          Limpiar selección
        </button>
        <button
          id="confirmBtn"
          className="confirm-btn"
          disabled={total === 0}
          onClick={handleOpenConfirm}
        >
          <span className="btn-label">Confirmar reservas</span>
        </button>
      </div>

      <ConfirmModal
        isOpen={isConfirmOpen}
        items={{ newItems, changeItems }}
        onClose={handleCloseConfirm}
        onConfirm={handleConfirm}
        isSubmitting={isSubmitting}
      />
    </section>
  );
}
