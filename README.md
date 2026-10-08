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
node scripts/verify-scroll-camera.mjs
```

## Estado actual

Se retiró la interfaz anterior; el historial de Git conserva esa implementación. Los originales y documentos de referencia fuera de `src/` y `public/` se conservan en el workspace.

Se mantienen Astro, TypeScript, las dependencias instaladas y el workflow de comprobación y compilación. La página conserva `noindex,nofollow` mientras está en construcción. El workflow no publica el sitio.

## Hero

- `src/components/SignalHero.astro`: estructura semántica, logo y superficie estática de respaldo.
- `src/assets/canario-wordmark.svg`: contornos del logo original, sin cambiar la tipografía ni requerir fuentes externas.
- `src/scripts/signal-hero.ts`: cámara vectorial con scroll nativo. El mouse matiza el recorrido antes de empezar; el destino siempre es el punto amarillo. El zoom es reversible.
- El logo flota suavemente y responde al mouse con un desplazamiento pequeño. Esta flotación desaparece al comenzar el zoom, para conservar el destino del recorrido.
- `src/scripts/scroll-camera.ts`: amortiguación y límite de velocidad visual. Un salto completo de scroll llega al amarillo en aproximadamente 2 segundos; un gesto lento conserva su posición objetivo y se asienta suavemente. Si el scroll supera el hero antes de terminar, la escena permanece visible hasta completar el zoom. El enlace de salto y la restauración de página omiten esta espera. La inclinación del acercamiento es de hasta 5° en sentido horario, independiente del mouse.
- `src/scripts/signal-cursor.ts`: aro decorativo con punto interior retrasado, respuesta al presionar y detección de proximidad al punto del logo. Conserva el cursor del sistema; no intercepta clics, se oculta al usar teclado y se desactiva en pantallas táctiles o con movimiento reducido.
- `src/scripts/signal-surface.ts`: superficie Three.js de 2,400 puntos redondos. Se detiene al salir de escena, completar su desvanecimiento u ocultar la pestaña.
- `src/scripts/signal-cycle.ts`: selección aleatoria con intensidad amarilla equivalente al 25%; las transiciones nunca colorean más del 30% del total. Cada nueva señal dura de 3 a 7 segundos y se intercambia con otra mediante un fundido de 0.6 segundos.
- `src/styles/site.css`: composición responsive y alternativa sin zoom para movimiento reducido.
- `src/scripts/signal-intro.ts`: primera escena posterior al hero. La superficie amarilla empieza vacía; el statement entra con scroll amortiguado, permanece centrado durante un tramo y sale con suavidad.
- El statement usa dos líneas escalonadas: primero aparece `Siempre hay algo`, desde el primer frame de la escena amarilla, y después `que podría funcionar mejor.` con un intervalo de scroll más amplio; la segunda línea cruza gradualmente de negro a blanco antes de desvanecerse.

El zoom termina en una sección vacía del mismo amarillo del logo (`#F0BC15`). Su contenido queda pendiente. No se interceptan rueda, gestos ni teclas de desplazamiento. Hay un enlace de salto visible al recibir foco con el teclado.

Sin JavaScript o con movimiento reducido se muestra el logo y una superficie estática, seguidos de la sección amarilla en scroll normal. Three.js se carga aparte y no se solicita cuando se prefiere movimiento reducido. Si WebGL falla, la superficie estática permanece disponible.

Las referencias proporcionadas y su atribución están documentadas en `licenses/hero-references.md`.

La dirección para las siguientes secciones está en `docs/design-philosophy.md`. Cada interacción debe reforzar la identidad, explicar el negocio o facilitar una acción útil.

El texto y la dirección facilitados el 7 de octubre de 2026 sustituyen las propuestas anteriores cuando exista alguna diferencia.
