import React from 'react';
import DayCard from './DayCard';
import { isPast } from '../../utils/dateUtils';

export default function WeekSection({
  week,
  onToggleMenu,
  onToggleExpand,
  onChangeTab,
  onWeekAction,
}) {
  const pastDays = week.days.filter((day) => isPast(day.dateStr));
  const currentDays = week.days.filter((day) => !isPast(day.dateStr));

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

      {pastDays.length > 0 && (
        <details className="past-days-accordion">
          <summary>Días anteriores ({pastDays.length})</summary>
          <div className="day-grid">
            {pastDays.map((day) => (
              <DayCard
                key={day.id}
                day={day}
                onToggleMenu={onToggleMenu}
                onToggleExpand={onToggleExpand}
                onChangeTab={onChangeTab}
              />
            ))}
          </div>
        </details>
      )}

      {currentDays.length > 0 && (
        <div className="day-grid">
          {currentDays.map((day) => (
            <DayCard
              key={day.id}
              day={day}
              onToggleMenu={onToggleMenu}
              onToggleExpand={onToggleExpand}
              onChangeTab={onChangeTab}
            />
          ))}
        </div>
      )}
    </section>
  );
}
