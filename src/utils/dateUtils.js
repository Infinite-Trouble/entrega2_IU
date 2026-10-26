export const REFERENCE_TODAY = new Date(2026, 8, 1); // 1 de Septiembre 2026

export function parseDate(str) {
  const [d, m, y] = str.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function isSameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function isToday(dateStr) {
  return isSameDay(parseDate(dateStr), REFERENCE_TODAY);
}

export function isPast(dateStr) {
  const d = parseDate(dateStr);
  return d < REFERENCE_TODAY && !isSameDay(d, REFERENCE_TODAY);
}

export function formatLongDate(str) {
  return parseDate(str).toLocaleDateString('es-CL', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}
