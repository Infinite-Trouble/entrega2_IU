import React from 'react';
import { MAX_NUTRITION } from '../../data/initialData';

function pct(val, max) {
  return Math.max(6, Math.min(100, Math.round((val / max) * 100)));
}

function MacroRow({ label, value, max, hint }) {
  return (
    <div className="macro-row">
      <span className="macro-label" title={hint || ''}>
        {label}
      </span>
      <div className="bar">
        <span style={{ width: `${pct(value, max)}%` }}></span>
      </div>
      <span className="macro-val">{value} g</span>
    </div>
  );
}

export default function DayDetail({ day, onChangeTab }) {
  const currentTab = day.tab || 'general';
  const n = day.nutrition[currentTab];
  const tabs = [
    { key: 'general', label: 'General' },
    { key: 'vegetariano', label: 'Vegetariano' },
    { key: 'hipocalorico', label: 'Hipocalórico' },
  ];

  return (
    <div className="day-detail">
      <div className="menu-block">
        <h3>Minuta del {day.name.toLowerCase()} {day.num}</h3>
        <dl>
          <dt>Sopa</dt>
          <dd>{day.menu.sopa}</dd>
          <dt>Entrada</dt>
          <dd>{day.menu.entrada}</dd>
          <dt>Fondo</dt>
          <dd>{day.menu.fondo}</dd>
          <dt>Vegetariano</dt>
          <dd>{day.menu.vegetariano}</dd>
          <dt>Hipocalórico</dt>
          <dd>{day.menu.hipocalorico}</dd>
          <dt>Postre</dt>
          <dd>{day.menu.postre}</dd>
        </dl>
      </div>
      <div className="nutrition-block">
        <h3>Aporte nutricional</h3>
        <div className="nutrition-tabs" role="tablist" aria-label="Tipo de menú">
          {tabs.map((t) => (
            <button
              key={t.key}
              className={`tab-btn ${currentTab === t.key ? 'active' : ''}`}
              role="tab"
              aria-selected={currentTab === t.key}
              onClick={() => onChangeTab(day.id, t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="nutrition-values">
          <div className="kcal-value">
            {n.kcal} <span>kcal</span>
          </div>
          <MacroRow
            label="Proteínas"
            value={n.protein}
            max={MAX_NUTRITION.protein}
            hint="Referencia diaria: 45 g"
          />
          <MacroRow
            label="Carbohidratos"
            value={n.carbs}
            max={MAX_NUTRITION.carbs}
            hint="Referencia diaria: 105 g"
          />
          <MacroRow
            label="Grasas"
            value={n.fat}
            max={MAX_NUTRITION.fat}
            hint="Referencia diaria: 40 g"
          />
        </div>
      </div>
    </div>
  );
}
