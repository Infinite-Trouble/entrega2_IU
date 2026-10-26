import React, { useEffect } from 'react';

export default function HelpPanel({ isOpen, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <aside
      id="helpPanel"
      className={`help-panel ${isOpen ? 'open' : ''}`}
      aria-hidden={!isOpen}
      aria-label="Ayuda del sistema"
    >
      <button
        className="help-close"
        id="helpClose"
        aria-label="Cerrar ayuda"
        onClick={onClose}
      >
        ×
      </button>
      <h2>Ayuda rápida</h2>

      <h3>¿Cómo reservar un menú especial?</h3>
      <ol>
        <li>
          En la pestaña <strong>Reserva de menú</strong>, elige los días que
          quieras cambiar.
        </li>
        <li>
          Presiona <em>Vegetariano</em> o <em>Hipocalórico</em> (o las teclas{' '}
          <kbd>V</kbd> / <kbd>H</kbd> con la tarjeta enfocada).
        </li>
        <li>
          Revisa el detalle con <em>Ver minuta y nutrición</em>.
        </li>
        <li>Confirma con el botón inferior.</li>
      </ol>

      <h3>¿Cómo cambio una reserva ya confirmada?</h3>
      <p style={{ fontSize: '0.88rem', color: 'var(--ink-soft)', margin: '6px 0 0' }}>
        En un día ya reservado, presiona el <strong>otro</strong> tipo de menú.
        Verás un borde punteado indicando &quot;cambio pendiente&quot;. Confirma para
        aplicar el cambio.
      </p>

      <h3>¿Cómo libero un día?</h3>
      <p style={{ fontSize: '0.88rem', color: 'var(--ink-soft)', margin: '6px 0 0' }}>
        Ve a <strong>Mis reservas</strong> y presiona <em>Anular</em>. El día
        quedará libre para una nueva selección.
      </p>

      <h3>¿Hasta cuándo puedo anular?</h3>
      <p style={{ fontSize: '0.88rem', color: 'var(--ink-soft)', margin: '6px 0 0' }}>
        Hasta las <strong>16:00 h del día anterior</strong>. Después de ese
        plazo la reserva se considera consumida.
      </p>

      <h3>Atajos de teclado</h3>
      <ul>
        <li>
          <kbd>V</kbd> — Marcar vegetariano
        </li>
        <li>
          <kbd>H</kbd> — Marcar hipocalórico
        </li>
        <li>
          <kbd>Enter</kbd> — Expandir minuta
        </li>
        <li>
          <kbd>Esc</kbd> — Cerrar diálogos
        </li>
      </ul>

      <h3>¿Necesitas más ayuda?</h3>
      <p style={{ fontSize: '0.88rem', color: 'var(--ink-soft)' }}>
        Escríbenos a <a href="mailto:casino@usm.cl">casino@usm.cl</a> o acércate
        al mesón del casino.
      </p>
    </aside>
  );
}
