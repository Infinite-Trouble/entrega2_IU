import React from 'react';

export default function Header({ username, onLogout }) {
  return (
    <header className="app-header">
      <div className="app-brand">USM.cl</div>
      <div className="app-user">
        <span id="display-username">{username}</span>
        <a
          href="#logout"
          id="logout-btn"
          onClick={(e) => {
            e.preventDefault();
            onLogout();
          }}
        >
          Cerrar sesión
        </a>
      </div>
    </header>
  );
}
