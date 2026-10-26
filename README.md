# MVP React · Sistema Casino USM

---

## 1. Contexto

El prototipo de la Entrega 2 se testeó con **6 usuarios** sobre 4 tareas. Los resultados (T1 = 20 s promedio, T2 = 38 s, T3 = 13 s, T4 = 12 s) muestran que **solo T1 y T2 tienen problemas de interfaz**. T3 y T4 no hay que tocarlos.

Los usuarios que reportaron problemas:

| Usuario | Tarea | Problema observado |
|---|---|---|
| Anaís | T1 | Creyó que el menú especial estaba "en otra parte". |
| Anaís | T2 | Creyó que los botones "Vegetariano" / "Hipocalórico" eran información del menú del día. |
| Susana | T2 | Intentó reservar varios días arrastrando el mouse. |
| Sebastián | T1 | Pensó que los platos disponibles eran "un registro de platos anteriores". |


---

## 2. Metas de usuario que el MVP debe permitir completar


### Meta 1 — "Quiero ver qué puedo almorzar esta semana y cuántas calorías tiene"


### Meta 2 — "Quiero reservar menús veg e hipo para varios días en una sola pasada"



### Meta 3 — "Quiero revisar mis reservas y anular una si me surgió un imprevisto"


---

## 3. Tareas pendientes

### Tarea 1 — Mostrar los 3 menús del día en la tarjeta

- **Problema que resuelve:** Anaís y Sebastián creyeron que el menú especial estaba en otra parte.
- **Archivos a intervenir:**
  - `src/components/reserva/DayCard.jsx` (estructura visual de la tarjeta)
  - `src/components/reserva/DayDetail.jsx` (panel expandido de minuta)
  - `src/index.css` (estilos de filas de previsualización)
- **Dónde se encuentra qué cambiar:**
  - En `src/components/reserva/DayCard.jsx`: Reemplazar el bloque actual `<p className="day-preview"><strong>Fondo:</strong> {day.menu.fondo}</p>` por tres filas visibles que presenten los tres platos disponibles (`day.menu.fondo`, `day.menu.vegetariano`, `day.menu.hipocalorico`) sin necesidad de expandir.
  - En `src/components/reserva/DayCard.jsx`: Cambiar el rótulo "Fondo:" por "Menú general:".
  - En `src/components/reserva/DayDetail.jsx`: Mantener en la lista de definición (`<dl>`) solo los complementos (sopa, entrada, postre) o ajustar la jerarquía, ya que los 3 fondos estarán visibles en la tarjeta principal.
- **Criterio de aceptación:** Al cargar la vista de reserva, se leen a simple vista los tres platos principales de cada día sin hacer clic.

---

### Tarea 2 — Que los botones se vean como botones

- **Problema que resuelve:** Anaís (T2) creyó que "Vegetariano" / "Hipocalórico" eran etiquetas informativas.
- **Archivos a intervenir:**
  - `src/components/reserva/DayCard.jsx` (markup de botones y textos)
  - `src/index.css` (estilos `.toggle`, `.toggle-veg`, `.toggle-hipo`, `.active`, `:hover`)
- **Dónde se encuentra qué cambiar:**
  - En `src/components/reserva/DayCard.jsx`: En el contenedor `<div className="day-actions">`, integrar la Tarea 1 para que cada plato especial sea una fila-botón clickeable que incluya su nombre y plato (ej. `＋ Vegetariano · Fritos de coliflor`).
  - En `src/components/reserva/DayCard.jsx`: Agregar una línea guía explicativa inmediatamente sobre los botones: `<span className="day-actions-hint">Toca un menú para reservarlo</span>`.
  - En `src/components/reserva/DayCard.jsx`: Renderizar un ícono o indicador `✓` en el botón cuando esté en estado seleccionado.
  - En `src/index.css`: Reforzar en las clases `.toggle`, `.toggle-veg` y `.toggle-hipo` los estados `:hover`, `cursor: pointer` y fondo sólido con contraste claro cuando tengan la clase `.active`.
- **Criterio de aceptación:** Ningún usuario confunde los botones de selección con texto estático o etiquetas informativas.

---

### Tarea 3 — Seleccionar varios días con Shift + clic o arrastrar el mouse

- **Problema que resuelve:** Susana intentó arrastrar el mouse para reservar un rango de días.
- **Archivos a intervenir:**
  - `src/App.jsx` (función `handleToggleMenu` y estado de último día seleccionado)
  - `src/components/reserva/DayCard.jsx` (captura del evento click con `shiftKey`)
  - `src/components/reserva/ReservaView.jsx` (pista visual bajo la leyenda)
  - `src/components/reserva/WeekSection.jsx` (botones rápidos de semana)
- **Dónde se encuentra qué cambiar:**
  - En `src/App.jsx`: Agregar una referencia (`useRef` o estado `lastClickedDayId`) para registrar el último día presionado. En `handleToggleMenu(dayId, type, isShift)`, si `isShift` es verdadero, calcular los días contiguos entre `lastClickedDayId` y `dayId` que no sean pasados (`!isPast(d.dateStr)`) y asignarles el mismo menú especial.
  - En `src/components/reserva/DayCard.jsx`: Pasar el evento o `e.shiftKey` al invocar `onToggleMenu(dayId, type, e.shiftKey)`.
  - En `src/components/reserva/ReservaView.jsx`: Inmediatamente debajo de `<div className="legend">`, agregar un texto visible de ayuda: `<p className="shift-hint">💡 Tip: Shift + clic para marcar varios días consecutivos</p>`.
  - En `src/components/reserva/WeekSection.jsx`: En `<div className="week-actions">`, renombrar el texto de los botones rápidos de `"Toda veg"` a **"Toda la semana: Vegetariano"** y de `"Toda hipo"` a **"Toda la semana: Hipocalórico"**.
- **Criterio de aceptación:** Se puede reservar un rango de días contiguos manteniendo Shift con un solo clic adicional, y la pista de uso es visible sin necesidad de abrir la ayuda.

---

### Tarea 4 — Ocultar días pasados y partir en hoy

- **Problema que resuelve:** Sebastián (T1) pensó que la lista de días era un registro histórico.
- **Archivos a intervenir:**
  - `src/components/reserva/WeekSection.jsx` (agrupación y colapso de días pasados)
  - `src/components/reserva/DayDetail.jsx` (título dinámico con fecha)
  - `src/components/reserva/ReservaView.jsx` (enfoque o posición inicial en día actual)
- **Dónde se encuentra qué cambiar:**
  - En `src/components/reserva/WeekSection.jsx`: Separar `week.days` entre días pasados (`isPast(day.dateStr)`) y días vigentes. Si hay días pasados en la semana, envolverlos dentro de un elemento `<details className="past-days-accordion"><summary>Días anteriores ({n})</summary>...</details>` para que comiencen colapsados.
  - En `src/components/reserva/DayDetail.jsx`: En la cabecera del panel expandido, reemplazar el texto estático `<h3>Platos del día</h3>` por un título contextual con la fecha: `<h3>Minuta del {day.name.toLowerCase()} {day.num}</h3>`.
  - En `src/components/reserva/ReservaView.jsx`: Al montar la vista, enfocar o asegurar visibilidad inmediata del día marcado con el badge `Hoy` (01/09).
- **Criterio de aceptación:** Al ingresar a la vista de reserva, la primera tarjeta visible corresponde al día de hoy o futuro; los días ya concluidos están agrupados y colapsados.

---

### Tarea 5 — Unificar contadores de almuerzos

- **Problema que resuelve:** En *Mis reservas* el contador muestra `reservas + consumos`, mientras que en *Mis consumos* el valor estaba hardcodeado en 4.
- **Archivos a intervenir:**
  - `src/components/mis-consumos/MisConsumosView.jsx` (reemplazo del valor estático)
  - `src/components/mis-reservas/MisReservasView.jsx` (consumo del balance unificado)
  - `src/App.jsx` (o nuevo hook `src/hooks/useBalances.js`)
- **Dónde se encuentra qué cambiar:**
  - En `src/components/mis-consumos/MisConsumosView.jsx`: Reemplazar el número estático `<div className="value">4</div>` por una prop `totalAlmuerzos` (o valor retornado por el hook) para que coincida exactamente con el cálculo de Mis Reservas (`reservations.length + consumptions.length`).
  - En `src/App.jsx`: Pasar `totalAlmuerzos` como prop a `<MisConsumosView consumptions={consumptions} totalAlmuerzos={totalAlmuerzos} />` o centralizar el cálculo en un hook reutilizable `src/hooks/useBalances.js`.
- **Criterio de aceptación:** Ambas pestañas (*Mis reservas* y *Mis consumos*) muestran siempre el mismo número consistente de almuerzos acumulados.

---