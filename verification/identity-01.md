# Identidad, laboratorio 01 — 5 de octubre de 2026

Prueba de identidad visual aislada en `/laboratorio/identidad`, solo en desarrollo. No reconstruye la landing ni añade motion narrativo. El plan de reconstrucción de la tarea anterior no estaba en el repositorio, GitHub, artifacts ni Drive; esta prueba sigue las correcciones del encargo del 5 de octubre.

## Alcance

Wordmark `canario studios` en una línea con Signal Dot sobre la ı sin punto de `canario`, tres calibraciones cercanas (C1 punto original, C2 círculo óptico, C3 círculo de señal), paleta black / canary / warm white con neutrales mínimos, Cabinet Grotesk + Switzer, escala de titulares, body, labels, metadata, líneas, grid, espacio, CTA, composiciones en black y warm white, costura black → warm white y regreso a black. Apertura A (solo wordmark) y B (con `Digital transformation studio · El Salvador`), sin declarar ganadora.

## Geometría medida

Cabinet Grotesk variable, UPM 1000, descendente 280, altura x 485, punto de la i hasta 670. A peso 600 el punto original es un rectángulo de 0.0996 × 0.1105 em con base en 0.5595 em. C2 usa un círculo de igual área (Ø 0.1184 em) con el mismo centro. C3: Ø 0.132 em, centro 0.010 em más alto, peso 620/480.

Superposición de la i real de Cabinet sobre C1 a 400 px: el rectángulo coincide con el punto tipográfico (`identity-01-signal-dot-verificacion.png`). La caja en línea de la ı mide 1.15 em, igual que ascendente + descendente, lo que confirma la referencia vertical usada.

## Comprobaciones

- `npm run check`: 0 errores, 0 advertencias, 0 hints.
- `npm run build`: 1 página (`/index.html`). La ruta del laboratorio no se genera. `dist` es idéntico byte a byte al build de `main`: el CSS del laboratorio se inserta en línea y `site.css` excluye sus carpetas del escaneo de Tailwind.
- Chromium (Playwright 1.56) en 1440 × 900, 390 × 844 y 320 × 640, además de 360, 768, 1024 y 1920 para desbordamiento: `scrollWidth` igual al ancho del viewport en todos.
- Fuentes: `Cabinet Grotesk 100 900 loaded`, `Switzer 100 900 loaded`; `document.fonts.check` verdadero para ambas.
- Wordmark: 20 instancias, todas de alto 1 em (una línea). Apertura: 112 px / 680.7 px de ancho en 1440; 48.4 px / 294.6 px con 47.7 px por lado en 390; 40 px / 240.6 px con 39.7 px por lado en 320. Las muestras de 48 px se ocultan por debajo de 380 px para no invadir márgenes.
- Colores computados: black rgb(17, 18, 16), warm white rgb(245, 243, 235), Signal Dot en black rgb(243, 223, 22), en warm white rgb(17, 18, 16) por defecto y canary con `?dot=canary`.
- Contraste WCAG: warm white / black 16.91:1, canary / black 13.76:1, stone 400 / black 5.58:1, stone 600 / warm white 5.25:1, canary / warm white 1.23:1 (no apto para texto, líneas ni puntos pequeños).
- Diacríticos: á é í ó ú ü ñ, mayúsculas, ¿ ¡ « » — · en Cabinet y Switzer, sin sustituciones. Archivos nuevos en UTF-8 sin secuencias de doble codificación.
- Controles: Tab llega al panel con contorno canary; radios con flechas; teclas 1/2/3, A/B, G y H; estado reflejado en `<html data-*>`, `aria-pressed` y la URL; mensajes en región `aria-live`. Al ocultar la interfaz con el foco dentro, el foco pasa al botón «Mostrar controles».
- Consola: sin errores ni advertencias en las tres anchuras.

## Hallazgos

- En Chrome sobre Linux, Switzer a 11–13 px mostraba avances redondeados («te xto», «Grote sk»). `text-rendering: geometricPrecision` en el laboratorio lo corrige. Conviene aplicarlo también a la landing cuando se reconstruya.
- El Tailwind de la landing también escanea `README.md` y `verification/*.md`: una palabra de la documentación que coincida con una utilidad añade CSS al sitio público. Se comprobó que `dist` sigue idéntico tras escribir esta nota.
- El commit `21dba88` de `main` dejó texto con doble codificación en `src/components/Home.astro` y `src/scripts/hero.ts`; la landing muestra «ñ», «ó» y «·» como pares de caracteres erróneos. No se tocó en esta tarea. `README.md` se corrigió porque se editó para documentar la ruta.

## Límites

Solo Chromium headless; no se probó Safari, Firefox ni teléfonos físicos. Las capturas son locales y quedan fuera de Git (`verification/*.png`). No se publicó nada.
