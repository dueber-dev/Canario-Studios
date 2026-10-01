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

Las rutas de revisión no se generan en `dist`. La versión actual tiene `noindex,nofollow`, no dominio configurado y no se ha publicado. El build estático no requiere un servidor de aplicación.

## Alcance actual

Composición responsive, entrada tipográfica una vez por sesión, hero con video, control de sonido que sigue al cursor con un desfase de 0.32 s, recorrido horizontal de tres escenas con GSAP/ScrollTrigger, proyecto Dueber atribuido al fundador, equipo sin fotos y contacto provisional autorizado `german@dueber.dev` mediante `mailto:`. No se envían correos desde el sitio.

El audio original se incorporó a copias del video horizontal y móvil sin recodificar. Empieza silenciado, requiere un clic para activarse y se detiene con el video fuera del hero o al ocultar la pestaña. Una imagen estática permanece disponible si el video falla, JavaScript no ejecuta o se solicita movimiento reducido. El usuario puede iniciar o pausar el video manualmente.

En escritorio con puntero fino, hacer clic sobre el hero activa o silencia el audio; la indicación sigue al cursor sin interceptar clics. Hay botones fijos para teclado y dispositivos táctiles. La música ambiental (Cylinder Six, Chris Zabriskie, CC BY 4.0) solo se carga después de un clic; sigue fuera del hero, con un control global de silencio. Ocultar la pestaña pausa ambos medios.

El recorrido horizontal se activa desde 1000 px de ancho y 650 px de alto, salvo movimiento reducido. En móvil, ventanas de poca altura, movimiento reducido o sin JavaScript, los servicios se leen verticalmente. La intro tiene salida CSS y temporizador propio para no bloquear el contenido si falla el script principal. Scroll nativo, sin Lenis ni motores redundantes.

## Recursos

Fuentes variables descargadas sin modificaciones desde Fontshare. Origen y licencias en `licenses/`. Originales de video conservados en la raíz y `video/`; archivos de web en `public/media/`. Véase `video/README.md` para la procedencia documentada del clip.

No publicar los archivos de fuentes como biblioteca o paquete para terceros. La distribución del sitio con fuentes alojadas para su propio diseño se rige por las licencias incluidas.

## Revisión

Consultar `verification/production-01.md` para las comprobaciones y límites actuales; `verification/review-01.md` conserva la revisión anterior. Los screenshots quedan en `verification/`, fuera del build público.

## Repositorio

Repositorio privado: https://github.com/dueber-dev/Canario-Studios. Rama principal: `main`. GitHub Actions comprueba tipos y compilación en cada push y pull request. No hay despliegue automático configurado.
