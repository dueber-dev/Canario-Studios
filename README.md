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
- `src/scripts/signal-hero.ts`: cámara vectorial con scroll nativo. El mouse matiza el recorrido antes de empezar; el destino siempre es el palo negro de la `i` de «canario», bajo el punto amarillo, y la pantalla termina en negro. El zoom es reversible.
- El logo flota suavemente y responde al mouse con un desplazamiento pequeño. Esta flotación desaparece al comenzar el zoom, para conservar el destino del recorrido.
- `src/scripts/scroll-camera.ts`: amortiguación y límite de velocidad visual. Una sola cámara recorre el zoom y todo SIGNAL; un salto al final tarda aproximadamente 9 segundos en completar la secuencia, con la primera frase empezando durante el cierre del zoom (alrededor de 1.9 segundos). Los gestos lentos conservan el control del progreso. El enlace de salto lleva directamente a la primera frase. La inclinación del acercamiento es de hasta 5° en sentido horario, independiente del mouse.
- `src/scripts/signal-cursor.ts`: aro decorativo con punto interior retrasado, respuesta al presionar y detección de proximidad al punto del logo. Conserva el cursor del sistema; no intercepta clics, se oculta al usar teclado y se desactiva en pantallas táctiles o con movimiento reducido.
- `src/scripts/signal-surface.ts`: superficie Three.js de 2,400 puntos redondos. Se detiene al salir de escena, completar su desvanecimiento u ocultar la pestaña.
- `src/scripts/signal-cycle.ts`: selección aleatoria con intensidad amarilla equivalente al 25%; las transiciones nunca colorean más del 30% del total. Cada nueva señal dura de 3 a 7 segundos y se intercambia con otra mediante un fundido de 0.6 segundos.
- `src/styles/site.css`: composición responsive y alternativa sin zoom para movimiento reducido.
- Todo permanece en un único viewport sticky durante 826svh de recorrido total (reloj compartido de 0 a 1.1). Al subir se reproducen exactamente los mismos estados en reversa.
- `src/scripts/signal-intro.ts`: escena sobre negro, replicando el diseño de Illustrator a sus proporciones de 1146 × 713 (todas las medidas en `cqw`, encajadas en el viewport). El título en mayúsculas sube palabra por palabra desde máscaras y solo `mejor` se ilumina en amarillo de izquierda a derecha. El recuadro se dibuja en sentido horario y luego aparece la red. `Un proceso.`, `Una identidad.` y `Una conexión.` entran atenuadas y se marcan en blanco una a la vez con el scroll. Al final todo sale hacia arriba antes del cierre. En pantallas verticales las piezas se apilan.
- `src/scripts/signal-network.ts`: la red del recuadro, inspirada en la referencia de Pinterest. Un nodo recorre una retícula fija; los puntos crecen al acercarse y se desvanecen a unas cuatro celdas, y doce líneas alcanzan el anillo a unas dos celdas. Canvas 2D, solo mientras la escena está en pantalla. El HTML incluye un póster SVG estático con la misma geometría para movimiento reducido o sin JavaScript.
- Entrada (`src/scripts/signal-hero.ts`): la página abre dentro del palo negro. Tras 0.35 s de negro, la misma cámara del zoom retrocede en 1.9 s hasta el wordmark, como el scroll en reversa, pero recta: el giro diagonal pertenece solo al zoom por scroll. Solo cuenta el tiempo con la pestaña visible, y si el visitante hace scroll durante la entrada, el scroll toma el control sin saltos. Un script en `<head>` mantiene el negro hasta el primer cuadro; si el script principal no llega, el wordmark aparece a los 2 segundos. No se reproduce con movimiento reducido ni al restaurar una posición de scroll.
- El punto cuadrado de la `i` de `studios` es un elemento propio del SVG (`data-studios-dot`) y gira sobre su centro, una vuelta cada 4 segundos, mientras el wordmark está a la vista. Se detiene al avanzar el zoom, al ocultar la pestaña y con movimiento reducido, donde queda recto.

- `src/scripts/signal-closing.ts`: `Esa es la señal.` en negrita, blanca y centrada sobre negro, según el diseño de Illustrator. Es una línea de tiempo GSAP pausada cuyo cabezal es el reloj compartido: las letras suben desde la línea base con un leve giro mientras la frase se asienta desde una escala de 1.12. Tras una pausa de lectura en blanco, cada letra de `señal` rueda a amarillo. Las letras se dividen en el HTML generado, sin cambios de layout al cargar el JavaScript. Con movimiento reducido o sin JavaScript se muestra la composición final.

SIGNAL queda completa hasta `Esa es la señal.`. El resto de la landing queda pendiente. No se interceptan rueda, gestos ni teclas de desplazamiento. Hay un enlace de salto visible al recibir foco con el teclado.

Sin JavaScript o con movimiento reducido se muestra el logo y una superficie estática, seguidos de la escena sobre negro en scroll normal, con las tres posibilidades en blanco. Three.js se carga aparte y no se solicita cuando se prefiere movimiento reducido. Si WebGL falla, la superficie estática permanece disponible.

Las referencias proporcionadas y su atribución están documentadas en `licenses/hero-references.md`.

La dirección para las siguientes secciones está en `docs/design-philosophy.md`. Cada interacción debe reforzar la identidad, explicar el negocio o facilitar una acción útil.

El texto y la dirección facilitados el 7 de octubre de 2026 sustituyen las propuestas anteriores cuando exista alguna diferencia.
