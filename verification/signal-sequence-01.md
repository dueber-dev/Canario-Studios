# SIGNAL completa — 7 de octubre de 2026

Se sustituyen las dos escenas independientes por un viewport sticky que contiene el logo y toda la narrativa. Las pruebas anteriores de signal-intro documentan iteraciones históricas, no los tiempos actuales.

## Recorrido

- Zoom del wordmark: 0–0.29 del progreso compartido.
- Primera línea: 0.225–0.27; aparece durante el cierre del zoom, directamente en su posición de lectura, solo con opacidad.
- Segunda línea: 0.35–0.395. Resaltado blanco exclusivo de “funcionar mejor”: 0.425–0.46.
- Pausa con “funcionar mejor” completamente blanco: 0.46–0.515, ampliada desde el intervalo anterior 0.46–0.475. Salida de la frase: 0.515–0.555.
- Transición de amarillo a blanco: 0.555–0.595, sin texto superpuesto durante el cambio.
- Proceso, identidad, conexión: entradas en 0.605, 0.685 y 0.765, en negro sobre blanco; las líneas anteriores se atenúan al 50% para conservar su legibilidad.
- Retirada de las posibilidades: 0.845–0.88. Fundido del blanco a negro: 0.865–0.925.
- Punto amarillo y un único pulso, seguidos de “Esa es la señal.”: 0.89–0.985. El final conserva su composición y queda estable para lectura.

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
