# Hero, revisión 03

Implementación de los ajustes solicitados tras revisar la versión 02. Esta revisión sustituye el comportamiento anterior de scroll y controles.

- Se eliminó el botón de pausa y el botón amarillo fijo. El aviso de cursor se muestra únicamente dentro del hero y desaparece tras el primer clic de activación, incluso si después se silencia desde las barras superiores.
- Barras sin círculo de hover y más pequeñas, conservando una zona táctil de 44 × 44 px y foco visible de teclado.
- Texto secundario reducido: párrafo de escritorio 20 px como máximo, etiqueta 12 px; móvil 17 px y 10 px. Wordmarks sin cambios. Eliminada la línea antes de la etiqueta.
- El marco conserva su límite de velocidad, pero ahora impide avanzar más allá del hero mientras está incompleto. Reversión y retorno al inicio disponibles. Los enlaces internos esperan y luego continúan. Movimiento reducido y posiciones restauradas fuera del hero evitan esta retención.
- Opera: superficie canvas decorativa y video oculto como fuente de fotogramas/audio. Límite de 30 fps y 1280 px de ancho. Pausa automática fuera del hero y al ocultar la pestaña. Otros navegadores usan video nativo. Opera documenta sus herramientas propias de video en https://help.opera.com/en/latest/features/.

## Verificación

- Astro check sin errores ni advertencias; build estático correcto.
- Vista de escritorio 1440 × 900 y móvil 390 × 844 revisadas visualmente.
- Aviso: visible sobre el hero, oculto sobre la cabecera, oculto después de clic incluso al mover de nuevo el puntero. Audio activado y aria-pressed actualizado.
- Hover del botón superior: fondo computado rgba(0,0,0,0).
- Salto programático de 4000 px: retenido en 720 px con el viewport sticky en y=0; liberado después de progreso=1.
- Rueda real vía CDP en móvil: retenida en 675 px con progreso 0.09283. Nueva rueda después de completar: scrollY=1475, progreso=1.
- Gesto táctil real vía CDP: retenido en 675 px con progreso 0.15085 y viewport en y=0.
- Tecla End: retención en el límite del hero.
- Enlace Descubre cómo: a los 300 ms seguía retenido con progreso 0.18694; después completó el marco y navegó a #capacidades.
- Movimiento reducido: scrollY=2000 sin retención, marco estático completo.
- Rama de Opera probada en Chromium con agente de usuario de Opera: canvas visible 1280 × 720, píxeles dibujados, tiempo del video avanzando y elemento video oculto. No se comprobó en una instalación real de Opera; la ausencia de su barra requiere esa comprobación visual final.
