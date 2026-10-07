# Flotación y cursor — 7 de octubre de 2026

## Cambios

El logo tiene un desplazamiento vertical de hasta 8 px, deriva horizontal pequeña y una inclinación de hasta 0.16 grados. El mouse añade una respuesta amortiguada. La flotación desaparece durante el primer 16% del recorrido para conservar el destino del zoom. Se detiene fuera de escena, con la pestaña oculta y al solicitar movimiento reducido.

El cursor decorativo tiene un aro de 34 px y un punto amarillo de 6 px. El punto sigue al aro con más retraso y su desplazamiento queda limitado al interior. El aro se contrae al presionar, crece a 50 px y toma el amarillo al detectar proximidad al punto del logo. Sobre el destino amarillo, el punto del cursor cambia a negro. El cursor del sistema se conserva.

## Evidencia

- `npm run check`: 10 archivos; cero errores, advertencias y hints.
- Navegador integrado: variación de posición del logo observada entre fotogramas sin scroll, con el zoom en progreso 0.
- Cursor: estado inicial oculto; aparece tras mover el mouse; `pointer-events: none`; estado de detección con aro de 50 px y borde `rgb(240, 188, 21)`.
- Zoom: transición inspeccionada al 41.7% y llegada al destino con progreso 1; el cursor adopta su estado sobre amarillo.
- Teclado: Tab oculta el cursor; Enter en el enlace de salto lleva a la sección `#signal`.
- Móvil de 390 × 844: documento y viewport disponible de 375 px, sin desbordamiento horizontal; logo contenido mientras flota.
- Sin errores de consola registrados durante esta revisión.

Las preferencias de movimiento reducido y puntero táctil se contemplan en CSS y JavaScript; no se emularon como preferencias del dispositivo en el navegador integrado. No se probaron dispositivos físicos.

La filosofía facilitada por el usuario se conserva en `docs/design-philosophy.md` como criterio para las próximas secciones.
