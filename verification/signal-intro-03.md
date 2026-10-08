# Statement centrado y escalonado — 7 de octubre de 2026

## Cambios

La escena amarilla ahora presenta el texto en el orden solicitado:

> Siempre hay algo
> que podría funcionar mejor.

La primera línea conserva el peso fuerte de la entrada y la segunda usa un peso regular, sin destacar “funcionar mejor”. El bloque usa posicionamiento absoluto dentro de la etapa sticky y una transformación que mantiene su centro geométrico en el viewport durante la escena.

La segunda línea comienza a aparecer después de un tramo de scroll más amplio (`0.30 → 0.50` del progreso amortiguado), mientras la primera línea y la visibilidad general comienzan en el progreso `0` y terminan de entrar suavemente (`0 → 0.13` y `0 → 0.16`). El tamaño tipográfico se redujo para dejar más aire alrededor del bloque. En el tramo posterior, la frase completa conserva su transición gradual a blanco.

## Verificación

- `npm run check` — correcto, sin diagnósticos de Astro.
- `npm run build` — correcto, una ruta estática generada en `/`.
- Navegador local en 670 × 764: en `progress ≈ 0.19` solo se ve `Siempre hay algo`; en `progress ≈ 0.65` aparecen ambas líneas y el bloque queda centrado.
- Navegador local en 390 × 844: ambas líneas caben sin overflow horizontal y el centro del bloque coincide con el centro del viewport.
