import React from 'react';
import DayCard from './DayCard';

export default function WeekSection({
  week,
  onToggleMenu,
  onToggleExpand,
  onChangeTab,
  onWeekAction,
}) {
  return (
    <section className="week">
      <div className="week-head">
        <h2>{week.label}</h2>
        <span className="week-range">{week.range}</span>
        <div className="week-actions">
          <button
            type="button"
            className="week-quick"
            title="Marcar toda la semana como vegetariano"
            onClick={() => onWeekAction('all-veg', week.label)}
          >
            Toda veg
          </button>
          <button
            type="button"
            className="week-quick"
            title="Marcar toda la semana como hipocalórico"
            onClick={() => onWeekAction('all-hipo', week.label)}
          >
            Toda hipo
          </button>
          <button
            type="button"
            className="week-quick"
            title="Limpiar selección pendiente de esta semana"
            onClick={() => onWeekAction('clear', week.label)}
          >
            Limpiar
          </button>
        </div>
      </div>
      <div className="day-grid">
        {week.days.map((day) => (
          <DayCard
            key={day.id}
            day={day}
            onToggleMenu={onToggleMenu}
            onToggleExpand={onToggleExpand}
            onChangeTab={onChangeTab}
          />
        ))}
      </div>
    </section>
  );
}
