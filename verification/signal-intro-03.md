# Statement centrado y escalonado — 7 de octubre de 2026

## Cambios

La escena amarilla ahora presenta el texto en el orden solicitado:

> Siempre hay algo
> que podría funcionar mejor.

Ambas líneas usan el mismo peso regular. Solo “funcionar mejor” dispone de una capa blanca superpuesta; “que podría” permanece negro durante toda la escena. El bloque usa posicionamiento absoluto dentro de la etapa sticky y una transformación que mantiene su centro geométrico en el viewport durante la escena.

La segunda línea comienza a aparecer después de un tramo de scroll más amplio (`0.30 → 0.50` del progreso amortiguado), mientras la primera línea y la visibilidad general ya son perceptibles en el primer frame de la escena y terminan de entrar suavemente (`-0.03 → 0.10` y `-0.04 → 0.12`). El tamaño tipográfico se redujo para dejar más aire alrededor del bloque. En el tramo posterior, la frase completa conserva su transición gradual a blanco.

La cámara del hero usa ahora el rango completo `0 → 1`. Esto elimina el tramo estático al final del zoom y permite que la misma trayectoria se reproduzca en reversa al subir.

La entrada del statement se precarga durante los últimos `34%` de un viewport antes de que la sección amarilla ocupe toda la pantalla. Se eliminó el desplazamiento vertical de entrada y el desenfoque se limitó a un máximo de `2px`, evitando que aparezca una sombra que sube antes del texto.

## Verificación

- `npm run check` — correcto, sin diagnósticos de Astro.
- `npm run build` — correcto, una ruta estática generada en `/`.
- Navegador local en 670 × 764: en `progress ≈ 0.19` solo se ve `Siempre hay algo`; en `progress ≈ 0.65` aparecen ambas líneas y el bloque queda centrado.
- Navegador local en 390 × 844: ambas líneas caben sin overflow horizontal y el centro del bloque coincide con el centro del viewport.
