# Primera versión: 1 de octubre de 2026

## Implementado

- Dirección A: Cabinet Grotesk + Switzer. Wordmarks sin punto, con igual proporción entre líneas.
- Intro tipográfica una vez por sesión: aparición, disolución y revelado del hero, sin trasladar el nombre. Se omite con movimiento reducido, enlaces con fragmento y almacenamiento no disponible.
- Control visual del sonido siguiendo el cursor en escritorio, con transición de 0.32 s. Un clic sobre el hero cambia el estado del sonido; enlaces y botones conservan su comportamiento. Al usar Tab, desaparece el seguidor y permanece el botón fijo.
- Video original con audio solo dentro del hero. Música ambiental opcional y control global de silencio; sin descarga musical antes de una activación explícita. La pestaña oculta pausa los medios.
- Tres escenas de servicios con scroll horizontal en ventanas de al menos 1000 × 650 px, navegación por escenas, progreso, ave decorativa y enlace para continuar al proyecto. En móvil, poca altura, movimiento reducido y sin scripts, lectura vertical.
- Proyecto Dueber atribuido al fundador, equipo sin fotografías y contacto por mailto autorizado.
- Repositorio privado y workflow de comprobación/compilación. No hay despliegue automático.

## Comprobaciones

- `npm run check`: 0 errores, 0 advertencias y 0 hints.
- `npm run build`: correcto. Solo la página principal se incluye; las dos rutas de comparación siguen siendo exclusivas de desarrollo.
- Chromium mediante agent-browser 0.38.1: 1440 × 900, 390 × 844 y comprobación adicional a 320 px. Sin desbordamiento horizontal.
- Verificado tanto el servidor de desarrollo como el build estático en el puerto 4322.
- Sin errores de ejecución detectados en las rutas y controles probados.
- Activación del sonido: música reproduciéndose y video sin silencio. Al salir del hero: video pausado y música reproduciéndose.
- Desfase del cursor medido: posición inicial 522 px, intermedia a 55 ms de 707.39 px y final 872 px, después de mover el objetivo 350 px.
- Navegación a escena 2: contador `02 / 03` y desplazamiento del contenido de -1440 px. Escena 3 y enlace de salida comprobados; el proyecto queda visible a 28 px del borde superior.
- Movimiento reducido: intro omitida, recorrido vertical, video pausado y sin descarga de música.
- Scripts externos bloqueados: tres servicios legibles, poster visible, controles no funcionales ocultos y contacto accesible.
- Auditoría axe-core 4.12.1 sobre build: escritorio 0 violaciones y 0 comprobaciones incompletas; móvil 0 violaciones y 1 comprobación incompleta de contraste en el wordmark de una tarjeta NFC decorativa inclinada. Inspección visual de esa tarjeta: texto oscuro visible sobre superficie clara, sin superposición que impida leerlo.

## Carga con recursos limitados

Medición de laboratorio sobre build local en Chromium: viewport móvil 390 × 844, caché HTTP desactivada, latencia 150 ms, descarga 1.6 Mbps, CPU ralentizada 4 veces. Resultados de una ejecución:

- FCP: 672 ms.
- LCP: 1220 ms, imagen de respaldo móvil del canario.
- CLS: 0.
- Intro activa al DOMContentLoaded y retirada al terminar.
- Cero solicitudes de música antes del clic; video inicialmente silenciado.

Estos valores describen esa emulación, no datos de usuarios ni una garantía para teléfonos reales. No se midió INP de campo. Las capturas y el JSON bruto de laboratorio permanecen en `verification/`, fuera del build y excluidos de Git.

## Pendiente para publicación

Dominio y metadatos absolutos de ese dominio, correo definitivo si cambia, retirada de `noindex` al autorizar publicación y confirmación de la procedencia del video conforme a `video/README.md`. No se ha publicado el sitio.
