# Protección contra saltos de scroll — 7 de octubre de 2026

El evento de scroll activa la escena fija antes del siguiente paint cuando el navegador ya saltó más allá del hero. La sección amarilla queda oculta mientras `data-holding-scene` está activo y recupera su visibilidad únicamente después de que la cámara alcanza `progress: 1`.

Esto elimina la ventana de un fotograma en la que podía verse la sección futura antes de que el zoom terminara.
