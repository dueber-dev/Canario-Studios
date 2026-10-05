# Canario Studios

Primera versión del sitio en Astro, con contenido en español. Dirección aprobada: Cabinet Grotesk + Switzer sobre fondo blanco.

## Desarrollo

```sh
npm ci
npm run dev -- --port 4321
npm run check
npm run build
npm run preview
```

- `/`: sitio principal.
- `/opcion-b`: opción B, General Sans. Solo desarrollo.
- `/revision`: comparador de tipografía y escritorio/móvil. Solo desarrollo.
- `/?intro=1`: repite la introducción al recargar, solo en desarrollo.
- `/laboratorio/identidad`: prueba de identidad visual de la nueva Canario Studios. Solo desarrollo.

Las rutas de revisión no se generan en `dist`. La versión actual tiene `noindex,nofollow`, no dominio configurado y no se ha publicado. El build estático no requiere un servidor de aplicación.

## Laboratorio de identidad

Hoja de revisión aislada de la landing: wordmark `canario studios` en una línea con el Signal Dot sobre la i de canario, paleta black / canary / warm white, Cabinet Grotesk + Switzer, escala tipográfica, líneas y grid, CTA y composiciones en black y warm white. Sin motion narrativo.

- Tokens y wordmark reutilizables: `src/styles/identity/tokens.css` y `src/styles/identity/wordmark.css`. Las calibraciones del wordmark viven en `src/components/identity/calibrations.ts`.
- El estado se puede fijar por URL: `?cal=1|2|3`, `?open=a|b`, `?dot=ink|canary`, `?grid=1`, `?clean=1`. Teclado: `1` `2` `3`, `A` `B`, `G` columnas, `H` oculta la interfaz de revisión.
- El CSS del laboratorio se inserta en línea y `site.css` excluye estas carpetas del escaneo de Tailwind, de modo que `dist` es idéntico con o sin el laboratorio.
- Verificación: `verification/identity-01.md`.

## Alcance actual

Composición responsive, entrada tipográfica una vez por sesión, hero con video, control de sonido que sigue al cursor con un desfase de 0.32 s, recorrido horizontal de tres escenas con GSAP/ScrollTrigger, proyecto Dueber atribuido al fundador, equipo sin fotos y contacto provisional autorizado `german@dueber.dev` mediante `mailto:`. No se envían correos desde el sitio.

El audio original se incorporó a copias del video horizontal y móvil sin recodificar. Empieza silenciado, requiere un clic para activarse y se detiene con el video fuera del hero o al ocultar la pestaña. Una imagen estática permanece disponible si el video falla, JavaScript no ejecuta o se solicita movimiento reducido. No hay botón de pausa; la preferencia de movimiento reducido mantiene el video detenido inicialmente.

En escritorio con puntero fino, hacer clic sobre el hero activa o silencia el audio; la indicación sigue al cursor sin interceptar clics. Hay botones fijos para teclado y dispositivos táctiles. La música ambiental (Cylinder Six, Chris Zabriskie, CC BY 4.0) solo se carga después de un clic; sigue fuera del hero, con un control global de silencio. Ocultar la pestaña pausa ambos medios.

El recorrido horizontal se activa desde 1000 px de ancho y 650 px de alto, salvo movimiento reducido. En móvil, ventanas de poca altura, movimiento reducido o sin JavaScript, los servicios se leen verticalmente. La intro tiene salida CSS y temporizador propio para no bloquear el contenido si falla el script principal. Scroll nativo, sin Lenis ni motores redundantes.

La introducción dura 3.2 segundos y puede omitirse con Escape o Tab. El hero empieza ocupando el viewport; una sección sticky permite revelar el marco blanco con scroll nativo. El progreso visual tiene un límite de 0.625 por segundo en ambos sentidos (mínimo 1.6 s para el recorrido completo, más la desaceleración). Un salto de scroll puede dejar atrás el hero; no se captura ni se bloquea el desplazamiento. Movimiento reducido muestra directamente el marco y omite esta transición. El botón de sonido usa Switzer, una cápsula amarilla y un indicador de cuatro barras en la esquina superior derecha.

El video desactiva Picture-in-Picture, reproducción remota y controles nativos. `astro.config.mjs` añade `Permissions-Policy: picture-in-picture=()` en desarrollo y preview. `public/_headers` conserva esa política para hosts estáticos compatibles; al elegir otro proveedor hay que configurar el mismo encabezado en él. No se cambian preferencias del navegador del visitante. En Opera (identificado por su agente de usuario), una superficie canvas muestra los fotogramas y el elemento video permanece oculto como fuente de imagen y audio. Esto evita ofrecer un reproductor visible a sus herramientas adicionales. El dibujo se limita a 30 fps y 1280 píxeles de ancho; el resto de navegadores mantiene video nativo.

## Recursos

Fuentes variables descargadas sin modificaciones desde Fontshare. Origen y licencias en `licenses/`. Originales de video conservados en la raíz y `video/`; archivos de web en `public/media/`. Véase `video/README.md` para la procedencia documentada del clip.

No publicar los archivos de fuentes como biblioteca o paquete para terceros. La distribución del sitio con fuentes alojadas para su propio diseño se rige por las licencias incluidas.

## Revisión

Consultar `verification/hero-02.md` para esta revisión del hero y `verification/production-01.md` para la comprobación general anterior. Los screenshots quedan en `verification/`, fuera del build público.

## Repositorio

Repositorio privado: https://github.com/dueber-dev/Canario-Studios. Rama principal: `main`. GitHub Actions comprueba tipos y compilación en cada push y pull request. No hay despliegue automático configurado.
