# Revisión 01: composición y tipografía

## Alcance comprobado

El visitante abre el sitio estático, identifica la oferta, puede explorar capacidades y equipo, visitar el proyecto Dueber atribuido a su fundador, y abrir su cliente de correo desde el contacto provisional. El revisor puede alternar entre dos tipografías y tamaños de vista sin que las herramientas de comparación entren al build público.

## Evidencia

- `npm run check`: 0 errores, 0 advertencias, 0 hints.
- `npm run build`: correcto; solo `/index.html`, sin `/revision` ni `/opcion-b`.
- Navegador: Chromium mediante agent-browser 0.38.1; escritorio 1440 × 900, móvil emulado 390 × 844, comprobación adicional de anchura 320 px.
- Rutas `/`, `/opcion-b` y `/revision`: responden y muestran contenido; sin overlay de error en la página principal ni errores de ejecución en los controles verificados.
- Fuente calculada en A: Cabinet Grotesk. Fuente calculada en B y después del selector: General Sans. Fondo de B comprobado blanco.
- Comparador: botón B cambia el iframe a `/opcion-b`; botón Móvil cambia su anchura a 390 px.
- Sin desbordamiento horizontal en las anchuras comprobadas de 1440, 390 y 320 px.
- Video empieza silenciado. Clic en sonido: `muted=false`, `aria-pressed=true`, reproducción activa. Botón de pausa detiene la reproducción y actualiza su nombre accesible. Fuera del hero: video pausado.
- Movimiento reducido: video pausado y silenciado, imagen visible; el control permite reproducir de forma explícita.
- Scripts externos bloqueados: contenido y poster visibles, controles de video ocultos y enlace de correo disponible.
- Enlaces de contacto: `mailto:german@dueber.dev` con asunto para Canario Studios. Se inspeccionaron los destinos; no se envió ningún correo ni se abrió una aplicación externa.
- Auditoría axe-core 4.12.1: 0 violaciones y 0 comprobaciones incompletas en B/escritorio y A/móvil, después de ajustar el contraste de los números de sección.
- Licencias oficiales de las tres fuentes conservadas en `licenses/`.
- Isotipo y maqueta anteriores eliminados a petición del usuario.

## Límites

Esta es una revisión de composición, no una entrega final de movimiento. Entrada tipográfica, música de fondo, silueta y recorrido horizontal pendientes de la elección visual y el storyboard. No se hizo una medición de Core Web Vitals en red limitada ni una prueba en teléfono físico. La auditoría automática no certifica toda la accesibilidad ni el contraste de cada fotograma del video.

El control de audio y su estado se comprobaron en navegador; la selección musical aún no existe. El sitio no está publicado y conserva `noindex,nofollow` durante esta revisión.

## Capturas

- `desktop-a.png`, `desktop-b.png`: comparación de hero en escritorio.
- `mobile-a.png`, `full-mobile-a.png`: composición móvil.
- `review-desktop.png`, `review-mobile-b.png`: interfaz de revisión.

Las capturas son artefactos locales de revisión, fuera del build.
