import React, { useState } from 'react';
import CancelModal from './CancelModal';
import { formatLongDate } from '../../utils/dateUtils';

export default function MisReservasView({
  reservations,
  totalAlmuerzos,
  onCancelReservation,
  onGoToReserva,
}) {
  const [filterText, setFilterText] = useState('');
  const [pendingCancel, setPendingCancel] = useState(null);

  const filteredReservations = reservations.filter((r) => {
    if (!filterText) return true;
    const q = filterText.toLowerCase();
    return (
      r.codigo.toLowerCase().includes(q) ||
      r.menu.toLowerCase().includes(q) ||
      r.fechaDesde.includes(q) ||
      r.fechaHasta.includes(q)
    );
  });

  const handleOpenCancel = (resId, dayId) => {
    setPendingCancel({ resId, dayId });
  };

  const handleCloseCancel = () => {
    setPendingCancel(null);
  };

  const handleConfirmCancel = () => {
    if (pendingCancel) {
      onCancelReservation(pendingCancel.resId, pendingCancel.dayId);
    }
    setPendingCancel(null);
  };

  return (
    <section
      id="view-mis-reservas"
      className="view active"
      aria-labelledby="h-reservas"
    >
      <header className="page-head" style={{ marginBottom: 20 }}>
        <h1 id="h-reservas">Mis reservas</h1>
      </header>

      <div className="balance-cards">
        <div className="balance-card">
          <div className="title">Almuerzos</div>
          <div className="value" data-balance="almuerzos">
            {totalAlmuerzos}
          </div>
        </div>
        <div className="balance-card">
          <div className="title">Cenas</div>
          <div className="value" data-balance="cenas">
            0
          </div>
        </div>
      </div>

      <div className="info-banner">
        <h3>Información importante</h3>
        <ul>
          <li>
            El plazo para anular una reserva es hasta las{' '}
            <strong>16:00 horas</strong> del día anterior a su consumo. Si la
            reserva tiene días consumidos, la fecha de término será actualizada.
          </li>
          <li>
            Si anula una reserva, puede volver a generarla en la pestaña{' '}
            <strong>Reserva de menú</strong>.
          </li>
        </ul>
      </div>

      <div className="table-toolbar">
        <label
          htmlFor="filterReservas"
          style={{ position: 'absolute', left: '-9999px' }}
        >
          Buscar reserva
        </label>
        <input
          type="search"
          id="filterReservas"
          className="form-input"
          placeholder="Buscar por código, fecha o menú…"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        />
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Acción</th>
              <th>Fecha registro</th>
              <th>Código reserva</th>
              <th>Fecha desde</th>
              <th>Fecha hasta</th>
              <th>Menú</th>
              <th>Campus/Sede reserva</th>
            </tr>
          </thead>
          <tbody id="tbl-reservas-body">
            {reservations.length === 0 ? (
              <tr>
                <td colSpan={7} className="empty-row">
                  <div className="empty-state">
                    <p>Aún no tienes reservas activas.</p>
                    <button
                      type="button"
                      className="btn-primary-sm"
                      id="emptyGoReserva"
                      onClick={onGoToReserva}
                    >
                      Ir a Reserva de menú
                    </button>
                  </div>
                </td>
              </tr>
            ) : filteredReservations.length === 0 ? (
              <tr>
                <td colSpan={7} className="empty-row">
                  No hay reservas que coincidan con &quot;{filterText}&quot;.
                </td>
              </tr>
            ) : (
              filteredReservations.map((r) => (
                <tr key={r.id}>
                  <td>
                    <button
                      type="button"
                      className="btn-cancel"
                      data-id={r.id}
                      data-day-id={r.dayId}
                      onClick={() => handleOpenCancel(r.id, r.dayId)}
                    >
                      Anular
                    </button>
                  </td>
                  <td>{r.fechaRegistro}</td>
                  <td>
                    <strong>{r.codigo}</strong>
                  </td>
                  <td>{formatLongDate(r.fechaDesde)}</td>
                  <td>{formatLongDate(r.fechaHasta)}</td>
                  <td>{r.menu}</td>
                  <td>{r.campus}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <CancelModal
        isOpen={Boolean(pendingCancel)}
        onClose={handleCloseCancel}
        onConfirm={handleConfirmCancel}
      />
    </section>
  );
}
