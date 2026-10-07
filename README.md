# Canario Studios

Base en Astro para la nueva landing page. La interfaz anterior se retiró y la ruta `/` muestra una página blanca, preparada para construir el nuevo hero.

## Desarrollo

```sh
npm ci
npm run dev -- --port 4321
npm run check
npm run build
npm run preview
```

## Estado actual

Se retiraron los componentes, estilos, animaciones, rutas de revisión y recursos públicos de la interfaz anterior. El historial de Git conserva esa implementación. Los originales y documentos de referencia fuera de `src/` y `public/` se conservan en el workspace.

Se mantienen Astro, TypeScript, las dependencias instaladas y el workflow de comprobación y compilación. La página conserva `noindex,nofollow` mientras está en construcción. El workflow no publica el sitio.

## Próxima implementación

El hero tendrá fondo blanco, el logo de Canario Studios y puntos animados en la parte inferior. El scroll acercará el logo hacia su punto amarillo hasta llenar la pantalla con ese color. Las dos referencias de movimiento están pendientes; el contenido de la sección amarilla se construirá después.

El texto y la dirección facilitados el 7 de octubre de 2026 sustituyen las propuestas anteriores cuando exista alguna diferencia.
