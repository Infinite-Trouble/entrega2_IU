import React from 'react';

export default function Footer() {
  return (
    <footer className="app-footer">
      <a href="#terminos" onClick={(e) => e.preventDefault()}>
        Términos y condiciones
      </a>{' '}
      ·{' '}
      <a href="#privacidad" onClick={(e) => e.preventDefault()}>
        Política de privacidad
      </a>{' '}
      · <a href="mailto:casino@usm.cl">Contacto: casino@usm.cl</a>
    </footer>
  );
}
