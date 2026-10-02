# Canario Studios

Primera versiÃ³n del sitio en Astro, con contenido en espaÃ±ol. DirecciÃ³n aprobada: Cabinet Grotesk + Switzer sobre fondo blanco.

## Desarrollo

```sh
npm ci
npm run dev -- --port 4321
npm run check
npm run build
npm run preview
```

- `/`: sitio principal.
- `/opcion-b`: opciÃ³n B, General Sans. Solo desarrollo.
- `/revision`: comparador de tipografÃ­a y escritorio/mÃ³vil. Solo desarrollo.
- `/?intro=1`: repite la introducciÃ³n al recargar, solo en desarrollo.

Las rutas de revisiÃ³n no se generan en `dist`. La versiÃ³n actual tiene `noindex,nofollow`, no dominio configurado y no se ha publicado. El build estÃ¡tico no requiere un servidor de aplicaciÃ³n.

## Alcance actual

ComposiciÃ³n responsive, entrada tipogrÃ¡fica una vez por sesiÃ³n, hero con video, control de sonido que sigue al cursor con un desfase de 0.32 s, recorrido horizontal de tres escenas con GSAP/ScrollTrigger, proyecto Dueber atribuido al fundador, equipo sin fotos y contacto provisional autorizado `german@dueber.dev` mediante `mailto:`. No se envÃ­an correos desde el sitio.

El audio original se incorporÃ³ a copias del video horizontal y mÃ³vil sin recodificar. Empieza silenciado, requiere un clic para activarse y se detiene con el video fuera del hero o al ocultar la pestaÃ±a. Una imagen estÃ¡tica permanece disponible si el video falla, JavaScript no ejecuta o se solicita movimiento reducido. No hay botón de pausa; la preferencia de movimiento reducido mantiene el video detenido inicialmente.

En escritorio con puntero fino, hacer clic sobre el hero activa o silencia el audio; la indicaciÃ³n sigue al cursor sin interceptar clics. Hay botones fijos para teclado y dispositivos tÃ¡ctiles. La mÃºsica ambiental (Cylinder Six, Chris Zabriskie, CC BY 4.0) solo se carga despuÃ©s de un clic; sigue fuera del hero, con un control global de silencio. Ocultar la pestaÃ±a pausa ambos medios.

El recorrido horizontal se activa desde 1000 px de ancho y 650 px de alto, salvo movimiento reducido. En mÃ³vil, ventanas de poca altura, movimiento reducido o sin JavaScript, los servicios se leen verticalmente. La intro tiene salida CSS y temporizador propio para no bloquear el contenido si falla el script principal. Scroll nativo, sin Lenis ni motores redundantes.

La introducciÃ³n dura 3.2 segundos y puede omitirse con Escape o Tab. El hero empieza ocupando el viewport; una secciÃ³n sticky permite revelar el marco blanco con scroll nativo. El progreso visual tiene un lÃ­mite de 0.625 por segundo en ambos sentidos (mÃ­nimo 1.6 s para el recorrido completo, mÃ¡s la desaceleraciÃ³n). Un salto de scroll puede dejar atrÃ¡s el hero; no se captura ni se bloquea el desplazamiento. Movimiento reducido muestra directamente el marco y omite esta transiciÃ³n. El botÃ³n de sonido usa Switzer, una cÃ¡psula amarilla y un indicador de cuatro barras en la esquina superior derecha.

El video desactiva Picture-in-Picture, reproducciÃ³n remota y controles nativos. `astro.config.mjs` aÃ±ade `Permissions-Policy: picture-in-picture=()` en desarrollo y preview. `public/_headers` conserva esa polÃ­tica para hosts estÃ¡ticos compatibles; al elegir otro proveedor hay que configurar el mismo encabezado en Ã©l. No se cambian preferencias del navegador del visitante. En Opera (identificado por su agente de usuario), una superficie canvas muestra los fotogramas y el elemento video permanece oculto como fuente de imagen y audio. Esto evita ofrecer un reproductor visible a sus herramientas adicionales. El dibujo se limita a 30 fps y 1280 píxeles de ancho; el resto de navegadores mantiene video nativo.

## Recursos

Fuentes variables descargadas sin modificaciones desde Fontshare. Origen y licencias en `licenses/`. Originales de video conservados en la raÃ­z y `video/`; archivos de web en `public/media/`. VÃ©ase `video/README.md` para la procedencia documentada del clip.

No publicar los archivos de fuentes como biblioteca o paquete para terceros. La distribuciÃ³n del sitio con fuentes alojadas para su propio diseÃ±o se rige por las licencias incluidas.

## RevisiÃ³n

Consultar `verification/hero-02.md` para esta revisiÃ³n del hero y `verification/production-01.md` para la comprobaciÃ³n general anterior. Los screenshots quedan en `verification/`, fuera del build pÃºblico.

## Repositorio

Repositorio privado: https://github.com/dueber-dev/Canario-Studios. Rama principal: `main`. GitHub Actions comprueba tipos y compilaciÃ³n en cada push y pull request. No hay despliegue automÃ¡tico configurado.
