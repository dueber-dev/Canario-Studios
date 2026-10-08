# SIGNAL completa — 7 de octubre de 2026

Se sustituyen las dos escenas independientes por un viewport sticky que contiene el logo y toda la narrativa. Las pruebas anteriores de signal-intro documentan iteraciones históricas, no los tiempos actuales.

## Recorrido

- Zoom del wordmark: 0–0.29 del progreso compartido.
- Primera línea: 0.225–0.27; aparece durante el cierre del zoom, directamente en su posición de lectura, solo con opacidad.
- Segunda línea: 0.35–0.395. Resaltado blanco exclusivo de “funcionar mejor”: 0.425–0.46.
- Salida de la frase: 0.475–0.515.
- Proceso, identidad, conexión: entradas en 0.53, 0.61 y 0.69, conservando las líneas anteriores atenuadas.
- Retirada de las posibilidades: 0.785–0.825. Fundido del amarillo a negro: 0.805–0.87.
- Punto amarillo y un único pulso, seguidos de “Esa es la señal.”: 0.835–0.93. El final queda estable para lectura.

Todas las propiedades se calculan a partir del mismo progreso. La secuencia no depende de callbacks de entrada/salida ni de temporizadores, y es reversible. Un scroll rápido mantiene el orden narrativo y el límite de velocidad. Se conserva el contenido en flujo normal sin JavaScript o con movimiento reducido.

## Comprobaciones

- Astro check: 13 archivos, sin errores, advertencias ni hints.
- Build estático correcto; persiste la advertencia preexistente de tamaño del bundle Three.js.
- Prueba de cámara compartida: avance y reversa, convergencia y velocidad máxima a 30, 60 y 144 fps.
- Navegador local: primera frase fija durante el cierre del zoom; solo “funcionar mejor” cambia de color.
- Navegador local: a progreso ~0.727, las posibilidades tienen los mismos estados de opacidad al bajar y al subir; el viewport sigue en top 0.
- Cierre verificado visualmente: fondo negro, punto amarillo y texto blanco estable.
- Ancho móvil 390px: las dos líneas caben, ambas con peso 400, sin desbordamiento horizontal.
- Salto por teclado: enfoca `#signal` en progreso ~0.29, con la primera línea visible y la segunda esperando su entrada.
