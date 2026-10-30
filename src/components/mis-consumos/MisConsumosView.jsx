import React, { useState } from 'react';
import { formatLongDate } from '../../utils/dateUtils';

export default function MisConsumosView({ consumptions, totalAlmuerzos = 4 }) {
  const [filterText, setFilterText] = useState('');

  const filteredConsumptions = consumptions.filter((c) => {
    if (!filterText) return true;
    const q = filterText.toLowerCase();
    return (
      c.fecha.includes(q) ||
      c.comedor.toLowerCase().includes(q) ||
      c.menu.toLowerCase().includes(q) ||
      c.sede.toLowerCase().includes(q)
    );
  });

  return (
    <section
      id="view-mis-consumos"
      className="view active"
      aria-labelledby="h-consumos"
    >
      <header className="page-head" style={{ marginBottom: 20 }}>
        <h1 id="h-consumos">Mis consumos</h1>
      </header>

      <div className="balance-cards">
        <div className="balance-card">
          <div className="title">Almuerzos</div>
          <div className="value">{totalAlmuerzos}</div>
        </div>
        <div className="balance-card">
          <div className="title">Cenas</div>
          <div className="value">0</div>
        </div>
      </div>

      <div className="info-banner">
        <h3>Información</h3>
        <p style={{ margin: 0 }}>
          Se muestran los consumos de los últimos <strong>90 días</strong>.
        </p>
      </div>

      <div className="table-toolbar">
        <label
          htmlFor="filterConsumos"
          style={{ position: 'absolute', left: '-9999px' }}
        >
          Buscar consumo
        </label>
        <input
          type="search"
          id="filterConsumos"
          className="form-input"
          placeholder="Buscar por fecha, comedor o menú…"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        />
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Nº</th>
              <th>Fecha</th>
              <th>Hora</th>
              <th>Tipo consumo</th>
              <th>Campus/Sede consumo</th>
              <th>Comedor</th>
              <th>Menú</th>
            </tr>
          </thead>
          <tbody id="tbl-consumos-body">
            {filteredConsumptions.length === 0 ? (
              <tr>
                <td colSpan={7} className="empty-row">
                  No hay consumos que coincidan con la búsqueda.
                </td>
              </tr>
            ) : (
              filteredConsumptions.map((c) => (
                <tr key={c.n}>
                  <td>{c.n}</td>
                  <td>{formatLongDate(c.fecha)}</td>
                  <td>{c.hora}</td>
                  <td>{c.tipo}</td>
                  <td>{c.sede}</td>
                  <td>{c.comedor}</td>
                  <td>{c.menu}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
