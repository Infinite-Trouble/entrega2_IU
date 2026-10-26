import React from 'react';

export default function Navigation({
  activeTab,
  onTabChange,
  helpOpen,
  onToggleHelp,
}) {
  return (
    <nav className="main-nav" aria-label="Navegación principal">
      <button
        className={`nav-btn ${activeTab === 'view-reserva' ? 'active' : ''}`}
        onClick={() => onTabChange('view-reserva')}
      >
        Reserva de menú
      </button>
      <button
        className={`nav-btn ${activeTab === 'view-mis-reservas' ? 'active' : ''}`}
        onClick={() => onTabChange('view-mis-reservas')}
      >
        Mis reservas
      </button>
      <button
        className={`nav-btn ${activeTab === 'view-mis-consumos' ? 'active' : ''}`}
        onClick={() => onTabChange('view-mis-consumos')}
      >
        Mis consumos
      </button>
      <button
        className="help-btn"
        id="helpToggle"
        aria-expanded={helpOpen}
        aria-controls="helpPanel"
        title="Ayuda"
        onClick={onToggleHelp}
      >
        ?
      </button>
    </nav>
  );
}
