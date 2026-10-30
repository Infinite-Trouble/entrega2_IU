import React, { useState, useRef, useEffect } from 'react';
import LoginView from './components/LoginView';
import Header from './components/Header';
import Navigation from './components/Navigation';
import HelpPanel from './components/HelpPanel';
import Toast from './components/Toast';
import ReservaView from './components/reserva/ReservaView';
import MisReservasView from './components/mis-reservas/MisReservasView';
import MisConsumosView from './components/mis-consumos/MisConsumosView';
import Footer from './components/Footer';
import {
  INITIAL_WEEKS,
  INITIAL_CONSUMPTIONS,
} from './data/initialData';
import { REFERENCE_TODAY, isPast } from './utils/dateUtils';

export default function App() {
  const [user, setUser] = useState({ isLoggedIn: false, name: '' });
  const [activeTab, setActiveTab] = useState('view-reserva');
  const [helpOpen, setHelpOpen] = useState(false);

  const [toast, setToast] = useState({
    message: '', variant: 'info', visible: false,
  });
  const toastTimerRef = useRef(null);

  const [weeks, setWeeks] = useState(() => JSON.parse(JSON.stringify(INITIAL_WEEKS)));
  const [reservations, setReservations] = useState([]);
  const [consumptions] = useState(INITIAL_CONSUMPTIONS);

  // Referencias para selección (Shift + click y Arrastre de Rango)
  const lastClickedDayRef = useRef(null);
  const weeksRef = useRef(weeks);
  
  const [dragState, setDragState] = useState({
    isDragging: false, startId: null, currentId: null, type: null,
  });
  const dragRef = useRef(dragState);

  useEffect(() => { weeksRef.current = weeks; }, [weeks]);
  useEffect(() => { dragRef.current = dragState; }, [dragState]);

  // Aplicar selección al soltar el clic en cualquier parte de la ventana
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      const { isDragging, startId, currentId, type } = dragRef.current;
      if (isDragging) {
        if (startId && currentId && startId !== currentId) {
          const all = weeksRef.current.flatMap((w) => w.days);
          const startIdx = all.findIndex((d) => d.id === startId);
          const currIdx = all.findIndex((d) => d.id === currentId);
          
          if (startIdx !== -1 && currIdx !== -1) {
            const min = Math.min(startIdx, currIdx);
            const max = Math.max(startIdx, currIdx);
            const idsToModify = all.slice(min, max + 1).map((d) => d.id);
            handleToggleMenu(null, type, false, idsToModify);
          }
        }
        setDragState({ isDragging: false, startId: null, currentId: null, type: null });
      }
    };
    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const showToast = (message, variant = 'info') => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast({ message, variant, visible: true });
    toastTimerRef.current = setTimeout(() => {
      setToast((prev) => ({ ...prev, visible: false }));
    }, 3500);
  };

  const closeToast = () => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast((prev) => ({ ...prev, visible: false }));
  };

  const handleLogin = (name) => {
    setUser({ isLoggedIn: true, name });
    showToast('Sesión iniciada correctamente.', 'success');
  };

  const handleLogout = () => {
    setUser({ isLoggedIn: false, name: '' });
    setActiveTab('view-reserva');
    showToast('Sesión cerrada.', 'info');
  };

  // Cálculo visual de días sombreados en tiempo real (para el arrastre)
  const allDaysFlat = weeks.flatMap((w) => w.days);
  let activeDragIds = [];
  if (dragState.isDragging && dragState.startId && dragState.currentId) {
    const startIdx = allDaysFlat.findIndex((d) => d.id === dragState.startId);
    const currIdx = allDaysFlat.findIndex((d) => d.id === dragState.currentId);
    if (startIdx !== -1 && currIdx !== -1) {
      const min = Math.min(startIdx, currIdx);
      const max = Math.max(startIdx, currIdx);
      activeDragIds = allDaysFlat.slice(min, max + 1).map((d) => d.id);
    }
  }

  // Reservation Interactions
  const handleToggleMenu = (dayId, type, isShift = false, dragIds = null) => {
    const labels = { vegetariano: 'vegetariano', hipocalorico: 'hipocalórico' };

    setWeeks((prevWeeks) => {
      let toastMsg = null;
      let toastType = 'info';
      const allDays = prevWeeks.flatMap((w) => w.days);
      
      let idsToModify = dragIds || [dayId];

      if (isShift && !dragIds && dayId && lastClickedDayRef.current?.type === type) {
        const currentIndex = allDays.findIndex((d) => d.id === dayId);
        const lastIndex = allDays.findIndex((d) => d.id === lastClickedDayRef.current.id);
        if (currentIndex !== -1 && lastIndex !== -1) {
          const minIdx = Math.min(currentIndex, lastIndex);
          const maxIdx = Math.max(currentIndex, lastIndex);
          idsToModify = allDays.slice(minIdx, maxIdx + 1).map((d) => d.id);
        }
      }

      const nextWeeks = prevWeeks.map((week) => ({
        ...week,
        days: week.days.map((day) => {
          if (!idsToModify.includes(day.id) || isPast(day.dateStr)) return day;
          const isRangeOrDrag = idsToModify.length > 1;

          if (day.reserved) {
            if (type === day.reserved) {
              if (day.special && day.special !== day.reserved) {
                if (!isRangeOrDrag) toastMsg = `Cambio cancelado. Se mantiene ${labels[day.reserved]}.`;
                return { ...day, special: null };
              } else {
                if (!isRangeOrDrag) toastMsg = `Este día ya está reservado como ${labels[day.reserved]}. Usa "Anular" en Mis reservas para liberarlo.`;
                return day;
              }
            }
            if (day.special === type) return day;
            if (!isRangeOrDrag) toastMsg = `Cambio pendiente a ${labels[type]}. Confirma para aplicarlo.`;
            return { ...day, special: type };
          }

          let newSpecial = day.special === type ? null : type;
          if (isRangeOrDrag) newSpecial = type;

          if (!isRangeOrDrag && newSpecial) {
            toastMsg = `Menú ${labels[newSpecial]} seleccionado para el ${day.name}${day.num}.`;
          }
          return { ...day, special: newSpecial };
        }),
      }));

      if (!dragIds && dayId) lastClickedDayRef.current = { id: dayId, type };

      if (idsToModify.length > 1) {
        showToast(`Varios días marcados como ${labels[type]}.`, 'success');
      } else if (toastMsg) {
        showToast(toastMsg, toastType);
      }

      return nextWeeks;
    });
  };

  const handleDragStart = (dayId, type = 'vegetariano') => {
    // Si se hace clic en la tarjeta sin tocar un botón específico, asume 'vegetariano'
    setDragState({ isDragging: true, startId: dayId, currentId: dayId, type });
  };

  const handleDragEnter = (dayId) => {
    if (dragState.isDragging && dragState.currentId !== dayId) {
      setDragState((prev) => ({ ...prev, currentId: dayId }));
    }
  };

  const handleToggleExpand = (dayId) => {
    setWeeks((prevWeeks) =>
      prevWeeks.map((week) => ({
        ...week,
        days: week.days.map((day) =>
          day.id === dayId ? { ...day, expanded: !day.expanded } : day
        ),
      }))
    );
  };

  const handleChangeTab = (dayId, tabKey) => {
    setWeeks((prevWeeks) =>
      prevWeeks.map((week) => ({
        ...week,
        days: week.days.map((day) =>
          day.id === dayId ? { ...day, tab: tabKey } : day
        ),
      }))
    );
  };

  const handleWeekAction = (action, weekLabel) => {
    setWeeks((prevWeeks) =>
      prevWeeks.map((week) => {
        if (week.label !== weekLabel) return week;
        return {
          ...week,
          days: week.days.map((d) => {
            if (isPast(d.dateStr)) return d;
            if (action === 'all-veg') {
              return { ...d, special: d.reserved === 'vegetariano' ? null : 'vegetariano' };
            } else if (action === 'all-hipo') {
              return { ...d, special: d.reserved === 'hipocalorico' ? null : 'hipocalorico' };
            } else if (action === 'clear') {
              return { ...d, special: null };
            }
            return d;
          }),
        };
      })
    );

    const msgMap = {
      'all-veg': `Toda la "${weekLabel}" marcada como vegetariano.`,
      'all-hipo': `Toda la "${weekLabel}" marcada como hipocalórico.`,
      clear: `Selección pendiente de "${weekLabel}" limpiada.`,
    };
    if (msgMap[action]) showToast(msgMap[action], 'info');
  };

  const handleClearSelection = () => {
    setWeeks((prevWeeks) =>
      prevWeeks.map((week) => ({
        ...week,
        days: week.days.map((d) =>
          isPast(d.dateStr) ? d : { ...d, special: null }
        ),
      }))
    );
    showToast('Selección pendiente limpiada.', 'info');
  };

  const handleConfirmReservations = async (newItems, changeItems) => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const todayStr = REFERENCE_TODAY.toLocaleDateString('es-CL', {
      day: '2-digit', month: '2-digit', year: 'numeric',
    });

    let newCount = 0;
    let changeCount = 0;
    const addedReservations = [];
    const updatedReservations = [...reservations];

    setWeeks((prevWeeks) =>
      prevWeeks.map((week) => ({
        ...week,
        days: week.days.map((d) => {
          if (isPast(d.dateStr) || !d.special) return d;

          const suffix = d.special === 'vegetariano' ? 'VEG' : 'HIPO';
          const [dd, mm, yyyy] = d.dateStr.split('-');
          const code = `RES-${yyyy}-${mm}-${dd}-${suffix}`;

          if (d.reserved && d.special !== d.reserved) {
            const existingIndex = updatedReservations.findIndex((r) => r.dayId === d.id);
            if (existingIndex !== -1) {
              updatedReservations[existingIndex] = {
                ...updatedReservations[existingIndex],
                menu: d.special === 'vegetariano' ? 'Vegetariano' : 'Hipocalórico',
                codigo: code,
                fechaRegistro: todayStr,
              };
            }
            changeCount++;
            return { ...d, reserved: d.special, special: null };
          } else if (!d.reserved) {
            addedReservations.push({
              id: code + '-' + Math.random().toString(36).slice(2, 6).toUpperCase(),
              fechaRegistro: todayStr,
              codigo: code,
              fechaDesde: d.dateStr,
              fechaHasta: d.dateStr,
              menu: d.special === 'vegetariano' ? 'Vegetariano' : 'Hipocalórico',
              campus: 'Casa Central Valparaíso',
              dayId: d.id,
            });
            newCount++;
            return { ...d, reserved: d.special, special: null };
          }

          return d;
        }),
      }))
    );

    setReservations([...updatedReservations, ...addedReservations]);

    const parts = [];
    if (newCount) parts.push(`${newCount} nueva${newCount !== 1 ? 's' : ''}`);
    if (changeCount)
      parts.push(`${changeCount} cambio${changeCount !== 1 ? 's' : ''}`);
    showToast(`Reservas actualizadas: ${parts.join(', ')}.`, 'success');

    setTimeout(() => {
      setActiveTab('view-mis-reservas');
    }, 600);
  };

  const handleCancelReservation = (resId, dayId) => {
    setReservations((prev) => prev.filter((r) => r.id !== resId));
    setWeeks((prevWeeks) =>
      prevWeeks.map((week) => ({
        ...week,
        days: week.days.map((d) =>
          d.id === dayId ? { ...d, reserved: null, special: null } : d
        ),
      }))
    );
    showToast(
      'Reserva anulada. El día quedó libre para una nueva selección.',
      'success'
    );
  };

  const totalAlmuerzos = reservations.length + consumptions.length;

  return (
    <>
      <Toast toast={toast} onClose={closeToast} />

      {!user.isLoggedIn ? (
        <LoginView onLogin={handleLogin} showToast={showToast} />
      ) : (
        <div id="app-content">
          <Header username={user.name} onLogout={handleLogout} />
          <Navigation
            activeTab={activeTab}
            onTabChange={setActiveTab}
            helpOpen={helpOpen}
            onToggleHelp={() => setHelpOpen((prev) => !prev)}
          />

          <div className="wrap">
            {activeTab === 'view-reserva' && (
              <ReservaView
                weeks={weeks}
                dragState={dragState}
                activeDragIds={activeDragIds}
                onToggleMenu={handleToggleMenu}
                onToggleExpand={handleToggleExpand}
                onChangeTab={handleChangeTab}
                onWeekAction={handleWeekAction}
                onClearSelection={handleClearSelection}
                onConfirmReservations={handleConfirmReservations}
                onDragStart={handleDragStart}
                onDragEnter={handleDragEnter}
              />
            )}

            {activeTab === 'view-mis-reservas' && (
              <MisReservasView
                reservations={reservations}
                totalAlmuerzos={totalAlmuerzos}
                onCancelReservation={handleCancelReservation}
                onGoToReserva={() => setActiveTab('view-reserva')}
              />
            )}

            {activeTab === 'view-mis-consumos' && (
              <MisConsumosView consumptions={consumptions} />
            )}
          </div>

          <Footer />

          <HelpPanel isOpen={helpOpen} onClose={() => setHelpOpen(false)} />
        </div>
      )}
    </>
  );
}