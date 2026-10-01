# Hero, revisión 02 — 2026-10-01

Cambios autorizados: intro más larga, video a todo el viewport, marco blanco progresivo con velocidad limitada, bloqueo de Picture-in-Picture y controles de sonido inspirados en leoparpeix.com. Switzer aprobada como alternativa; Cabinet Grotesk se conserva en el wordmark. No se copiaron fuentes comerciales ni recursos gráficos de la referencia.

## Comprobaciones

- Astro check: sin errores ni advertencias. Compilación estática correcta.
- Escritorio 1440 × 900: hero inicial en x=0, y=0, ancho=1440 y alto=900. Marco completo: x=22, y=100, ancho=1396, alto=772.
- Intro: visible y opaca a los 1207 y 2202 ms; descartada a los 3401 ms. Animación CSS de 3.2 s con respaldo JS a los 3.3 s. Primera visita de la sesión; `?intro=1` permite repetirla en desarrollo.
- Scroll instantáneo de 720 px: progreso suave hasta 1. Velocidad medida en ventanas de 100 ms: 0.6263/s, consistente con el límite de 0.625/s y el redondeo de muestreo. Prueba por tiempo real, independiente de la frecuencia del monitor.
- Movimiento reducido: sección sin sticky extendido, marco estático, video pausado y cursor animado oculto.
- Sonido: silenciado al cargar; sin petición de música antes de la interacción. Clic activa video y música, anima barras y actualiza aria-pressed. Segundo clic silencia y pausa música. Enter también activa/desactiva el botón global.
- PiP: `document.pictureInPictureEnabled` false; `disablePictureInPicture` y `disableRemotePlayback` true; controls false. `requestPictureInPicture()` rechazada con SecurityError por la política HTTP.
- Móvil 390 × 844 y 320 × 568: sin desbordamiento horizontal; inspección visual de estados inicial y con marco. Encuadre ajustado para separar la cabeza del canario del wordmark; degradado inferior para legibilidad.
- Axe: 0 infracciones detectadas; 1 comprobación incompleta de contraste en elementos del recorrido horizontal, con solapamiento identificado por la herramienta. No equivale a una auditoría exhaustiva de accesibilidad.

## Límites

Las pruebas automatizadas se hicieron en Chromium. Edge no pudo iniciarse desde agent-browser; un intento adicional con puerto de depuración fue rechazado por la política automática de permisos. No se confirmó visualmente el botón nativo de Edge. Los atributos y la política están aplicados; no se modificó el navegador del usuario.

No se ha publicado el sitio. El futuro hosting debe servir el encabezado Permissions-Policy; `_headers` solo funciona en proveedores compatibles. El scroll sigue siendo nativo: un salto muy grande puede abandonar la sección antes de que termine el efecto, sin acelerarlo artificialmente.
