# Canario Studios

Landing page de Canario Studios en Astro. La ruta `/` muestra el nuevo hero: fondo blanco, wordmark vectorial y una superficie ondulada de puntos que identifica señales amarillas.

## Desarrollo

```sh
npm ci
npm run dev -- --port 4321
npm run check
npm run build
npm run preview
node scripts/verify-signal-cycle.mjs
```

## Estado actual

Se retiró la interfaz anterior; el historial de Git conserva esa implementación. Los originales y documentos de referencia fuera de `src/` y `public/` se conservan en el workspace.

Se mantienen Astro, TypeScript, las dependencias instaladas y el workflow de comprobación y compilación. La página conserva `noindex,nofollow` mientras está en construcción. El workflow no publica el sitio.

## Hero

- `src/components/SignalHero.astro`: estructura semántica, logo y superficie estática de respaldo.
- `src/assets/canario-wordmark.svg`: contornos del logo original, sin cambiar la tipografía ni requerir fuentes externas.
- `src/scripts/signal-hero.ts`: cámara vectorial con scroll nativo. El mouse matiza el recorrido antes de empezar; el destino siempre es el punto amarillo. El zoom es reversible.
- `src/scripts/signal-surface.ts`: superficie Three.js de 2,400 puntos redondos. Se detiene al salir de escena, completar su desvanecimiento u ocultar la pestaña.
- `src/scripts/signal-cycle.ts`: selección aleatoria con intensidad amarilla equivalente al 25%; las transiciones nunca colorean más del 30% del total. Cada nueva señal dura de 3 a 7 segundos y se intercambia con otra mediante un fundido de 0.6 segundos.
- `src/styles/site.css`: composición responsive y alternativa sin zoom para movimiento reducido.

El zoom termina en una sección vacía del mismo amarillo del logo (`#F0BC15`). Su contenido queda pendiente. No se interceptan rueda, gestos ni teclas de desplazamiento. Hay un enlace de salto visible al recibir foco con el teclado.

Sin JavaScript o con movimiento reducido se muestra el logo y una superficie estática, seguidos de la sección amarilla en scroll normal. Three.js se carga aparte y no se solicita cuando se prefiere movimiento reducido. Si WebGL falla, la superficie estática permanece disponible.

Las referencias proporcionadas y su atribución están documentadas en `licenses/hero-references.md`.

El texto y la dirección facilitados el 7 de octubre de 2026 sustituyen las propuestas anteriores cuando exista alguna diferencia.
