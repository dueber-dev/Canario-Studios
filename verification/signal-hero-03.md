# Velocidad y dirección del zoom — 7 de octubre de 2026

## Comportamiento

La cámara ya no adopta de inmediato el valor que produce un salto de scroll. `ScrollCamera` limita el avance a `0.42` de progreso por segundo y usa una amortiguación de `120 ms`; un salto completo llega al amarillo en aproximadamente 2 segundos y se asienta en unos 3 segundos. Los gestos lentos siguen su objetivo sin retraso perceptible. Al cambiar de dirección, la cámara empieza a regresar inmediatamente.

El logo se inclina siempre `5°` en sentido horario durante el zoom. La inclinación es independiente de la posición del mouse, se desvanece cerca del final y la flotación queda reservada para el estado de apertura.

## Evidencia

- `node scripts/verify-scroll-camera.mjs`: simulado a 30, 60 y 144 FPS; el umbral amarillo llegó exactamente a 2.0 s y el asentamiento quedó entre 3.01 y 3.03 s.
- Navegador integrado: un scroll rápido produjo un objetivo de `1.00000` mientras el progreso era `0.00290`; después de 500 ms avanzó a `0.22210`; tras 2.5 s llegó a `1.00000`, con fondo `rgb(240, 188, 21)` y logo oculto.
- En progreso `0.30097`, el transform del wordmark reportó `rotate(5)`.
- El regreso rápido llegó a `progress: 0.00000`, fondo blanco y rotación residual `0.1379°`, que se elimina al asentarse.
- `npm run check`: 12 archivos; cero errores, advertencias y hints.
- `npm run build`: correcto. Vite conserva la advertencia informativa del módulo Three.js grande, que sigue cargándose por separado.

La escena puede mantenerse fija brevemente cuando un fling ya cruzó el final del hero; así el visitante ve completar la señal aunque el scroll haya sido rápido. El enlace de salto y la restauración de página conservan su comportamiento directo.
