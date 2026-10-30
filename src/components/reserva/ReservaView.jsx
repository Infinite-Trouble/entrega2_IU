import React, { useState, useEffect } from 'react';
import WeekSection from './WeekSection';
import ConfirmModal from './ConfirmModal';
import { isPast } from '../../utils/dateUtils';

export default function ReservaView({
  weeks,
  dragState,
  activeDragIds,
  onToggleMenu,
  onToggleExpand,
  onChangeTab,
  onWeekAction,
  onClearSelection,
  onConfirmReservations,
  onDragStart,
  onDragEnter,
}) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const todayCard = document.querySelector('.badge-today')?.closest('.day-card');
    if (todayCard) {
      todayCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      todayCard.focus();
    }
  }, []);

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
  if (newItems.length > 0) parts.push(`${newItems.length} nueva${newItems.length !== 1 ? 's' : ''}`);
  if (changeItems.length > 0) parts.push(`${changeItems.length} cambio${changeItems.length !== 1 ? 's' : ''}`);
  const countBreakText = parts.length ? `(${parts.join(', ')})` : '';

  const handleOpenConfirm = () => { if (total > 0) setIsConfirmOpen(true); };
  const handleCloseConfirm = () => { if (!isSubmitting) setIsConfirmOpen(false); };
  const handleConfirm = async () => {
    setIsSubmitting(true);
    await onConfirmReservations(newItems, changeItems);
    setIsSubmitting(false);
    setIsConfirmOpen(false);
  };

  return (
    <section id="view-reserva" className="view active" aria-labelledby="h-reserva">
      <style>{`
        .day-card {
          transition: background-color 0.15s, border-color 0.15s;
        }
        /* Efecto de rastro azul al arrastrar el mouse (días intermedios) */
        .day-card.in-drag-range {
          background-color: #e3f2fd !important;
          border-color: #90caf9 !important;
        }
        /* Extremos del rango de arrastre (origen y posición actual del mouse) */
        .day-card.drag-endpoint {
          background-color: #bbdefb !important;
          border-color: #1976d2 !important;
        }
      `}</style>

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
        <span className="legend-item"><i className="dot dot-general" aria-hidden="true"></i>Menú general (predeterminado)</span>
        <span className="legend-item"><i className="dot dot-veg" aria-hidden="true"></i>Vegetariano reservado</span>
        <span className="legend-item"><i className="dot dot-hipo" aria-hidden="true"></i>Hipocalórico reservado</span>
        <span className="legend-item"><i className="dot dot-past" aria-hidden="true"></i>Día no disponible</span>
      </div>

      <p className="shift-hint" style={{ textAlign: 'center', margin: '0.5rem 0 1.5rem', color: '#666' }}>
        💡 Tip: Shift + clic o <strong>arrastra el mouse</strong> sobre las tarjetas para reservar un menú vegetariano en varios días consecutivos
      </p>

      <main id="calendar" aria-live="polite">
        {weeks.map((week) => (
          <WeekSection
            key={week.label}
            week={week}
            dragState={dragState}
            activeDragIds={activeDragIds}
            onToggleMenu={onToggleMenu}
            onToggleExpand={onToggleExpand}
            onChangeTab={onChangeTab}
            onWeekAction={onWeekAction}
            onDragStart={onDragStart}
            onDragEnter={onDragEnter}
          />
        ))}
      </main>

      <div className="summary-bar" role="region" aria-label="Resumen de selección">
        <p className="summary-text">
          <strong id="countNum">{total}</strong> días con cambios pendientes{' '}
          <span id="countBreak">{countBreakText}</span>
        </p>
        <button id="clearBtn" className="btn-ghost" disabled={total === 0} onClick={onClearSelection}>
          Limpiar selección
        </button>
        <button id="confirmBtn" className="confirm-btn" disabled={total === 0} onClick={handleOpenConfirm}>
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