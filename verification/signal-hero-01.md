# Signal hero — 7 de octubre de 2026

## Recorrido comprobado

El visitante encuentra el logo sobre blanco y una superficie de puntos en movimiento. Al bajar, el logo aumenta hacia su punto amarillo, cubre la pantalla y conecta con una sección amarilla vacía. Al subir, el recorrido se invierte.

- Navegador integrado, viewport de escritorio 1440 × 900 y móviles 390 × 844 y 320 × 568. El ancho del documento coincide con el disponible en los tres tamaños; el logo no se recorta al inicio.
- Superficie WebGL activa, con 2,400 puntos, ondas y selección aleatoria de señales. El SVG de respaldo también se observó durante una incidencia de caché local de dependencias; reiniciar el servidor de desarrollo resolvió la carga.
- Zoom intermedio inspeccionado al 51.3% de recorrido y fondo final `rgb(240, 188, 21)` comprobado en escritorio y móvil.
- Retorno al inicio y uso de teclado: el enlace aparece con Tab y Enter lleva a `#signal`, que recibe el foco.
- Sin errores de consola registrados durante las comprobaciones. Las advertencias de importación de la incidencia de caché anterior se resolvieron antes de verificar la superficie WebGL.
- Prueba determinista de 180 segundos: intensidad amarilla equivalente al 25%; mínimo de puntos completamente amarillos 21.04%; máximo de puntos con algún tinte amarillo 28.96%; las 2,400 posiciones participaron en el ciclo.

## Alternativas y límites

El código mantiene una composición estática sin JavaScript y cuando se solicita movimiento reducido. La preferencia evita el zoom y la descarga de Three.js. Estas rutas se revisaron en el código; no se emuló la preferencia del sistema ni la desactivación de JavaScript en el navegador integrado. La recuperación de contexto WebGL está implementada, sin prueba de pérdida forzada. No se probaron Safari ni dispositivos físicos.

La compilación separa la cámara del módulo de Three.js. El módulo gráfico supera 500 KB sin comprimir y genera la advertencia de tamaño de Vite; se descarga de forma independiente. No se midieron Lighthouse ni tiempos en una conexión móvil limitada.

Las capturas locales `signal-hero-desktop.png` y `signal-hero-mobile.png` se guardan en esta carpeta y están excluidas de Git. La publicación a un dominio no forma parte de esta entrega.
