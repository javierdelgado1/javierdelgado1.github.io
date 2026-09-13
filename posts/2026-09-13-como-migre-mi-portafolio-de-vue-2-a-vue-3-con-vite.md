---
title: Cómo migré mi portafolio de Vue 2 a Vue 3 con Vite (sin reescribirlo desde cero)
description: Migré un portafolio de 2017 (Vue 2, Webpack 3, jQuery) a Vue 3 con Vite por fases, reemplazando cada dependencia muerta sin rehacer el diseño. Aquí está el plan, las decisiones y lo que aprendí.
date: 2026-09-13
category: Desarrollo web
tags: [vue, vite, javascript, migración, refactor]
cover: /assets/img/cover-vue3.jpg
coverAlt: Escritorio de trabajo con un portátil mostrando código
author: Javier Delgado
featured: true
keyPoints:
  - Antes de migrar el stack, cerré los problemas de seguridad (API key expuesta, formulario PHP vulnerable, código muerto).
  - La migración se hizo en una rama aparte y por fases; el sitio en producción nunca dejó de funcionar.
  - Mantuve la Options API para no reescribir los componentes; solo cambié lo que Vue 3 rompe.
  - Cada plugin de Vue 2 sin mantenimiento se reemplazó por una alternativa moderna o por unas pocas líneas propias.
  - El build pasó de Webpack 3 + Babel 6 (que ni arrancaba en Node 17+) a Vite, con despliegue automático por GitHub Actions.
---

Mi portafolio llevaba casi diez años con el mismo stack: **Vue 2.5, Webpack 3, Babel 6, jQuery 1.12** y una plantilla HTML comprada en 2016. Funcionaba, pero ya no compilaba en ninguna versión moderna de Node y cada dependencia tenía avisos de seguridad. En vez de rehacerlo con un framework nuevo, decidí migrarlo a **Vue 3 con Vite** conservando el diseño. Este artículo resume el método que seguí, que sirve para cualquier proyecto Vue 2 heredado.

## Empezar por la seguridad, no por el framework

Lo primero no fue tocar Vue. Fue revisar qué había en el repositorio que pudiera hacer daño hoy mismo:

- Una **API key de Google Maps** escrita en el `index.html`, para un mapa que ni siquiera se mostraba. Se eliminó del código, pero como sigue en el historial público de git, la única solución real es rotarla y restringirla por dominio.
- Un **formulario de contacto en PHP** sin validación ni protección. El componente Vue ya enviaba los datos a otro backend, así que el PHP era código muerto y peligroso a la vez.
- Una integración con la **API v1.1 de Twitter**, cerrada hace años.
- La carpeta `dist/` versionada en git y dos archivos `.zip` con copias del proyecto.

Todo eso se puede limpiar en una tarde y no depende de ninguna migración. Si el proyecto muere a mitad del camino, al menos queda más seguro que antes.

## Un roadmap por fases, en una rama separada

Escribí el plan en un archivo Markdown dentro del propio repositorio, con casillas para marcar el avance. Las fases fueron:

| Fase | Objetivo | Resultado |
| --- | --- | --- |
| 0 | Seguridad inmediata | API key fuera del código, PHP y Twitter eliminados, artefactos fuera de git |
| 1 | Limpieza del entorno | `browserslist` actualizado, plantillas HTML originales borradas, imports sin uso fuera |
| 2 | Andamiaje Vue 3 + Vite | Proyecto Vite nuevo, componentes migrados uno por uno |
| 3 | Reemplazo de dependencias | Cada plugin de Vue 2 sustituido o eliminado |
| 5 | Estilos y assets | Pendiente: SCSS al pipeline de Vite, iconos a SVG |
| 6 | Despliegue | GitHub Actions publica `dist/` en GitHub Pages en cada push a `master` |

La clave fue trabajar en la rama `migration/vue3` mientras `master` seguía sirviendo el sitio viejo. Nada de "big bang".

## Vue 3 sin reescribir los componentes

Vue 3 sigue soportando la **Options API**, así que casi todos los componentes se movieron con cambios mínimos: `new Vue()` pasó a `createApp()`, los filtros desaparecieron y el `eventBus` (que en Vue 2 era una instancia vacía de Vue) se reemplazó por [mitt](https://github.com/developit/mitt), que hace lo mismo en 200 bytes.

Lo que sí exigió trabajo fue todo lo que hacía **jQuery desde `core.js`**, el script de la plantilla original: el loader de página, el header que se fija al hacer scroll, el panel lateral móvil y el modal de proyectos. Cada uno se reescribió como comportamiento Vue:

```js
// App.vue — header fijo al pasar la altura del top-bar (antes lo hacía core.js con jQuery)
mounted() {
  document.body.classList.add('loaded')
  this.setHeader()
  window.addEventListener('scroll', this.setHeader, { passive: true })
},
methods: {
  setHeader() {
    const topBar = document.getElementById('top-bar')
    const limit = topBar ? topBar.offsetHeight : 0
    document.body.classList.toggle('sticky-layout', window.scrollY >= limit)
  }
}
```

Con eso, jQuery, Bootstrap JS, Masonry, Owl Carousel e Isotope salieron del proyecto de golpe.

## Qué reemplazó a cada dependencia de Vue 2

Esta fue la parte más entretenida. La regla: si un plugin no se actualizó a Vue 3, buscar el reemplazo más pequeño posible, y si lo que hace cabe en veinte líneas, escribirlo.

| Vue 2 | Vue 3 | Comentario |
| --- | --- | --- |
| `vue-multilanguage` | `vue-i18n` | Los diccionarios `en`/`es` se movieron a `src/i18n.js`; `v-lang.x.y` pasó a `v-html="$t('x.y')"` |
| `vue-carousel` | `@splidejs/vue-splide` | Mantiene la misma UX del carrusel |
| `vue-gallery` | `vue-easy-lightbox` | Para la galería de certificados |
| `vue-typer` | Componente propio `Typer.vue` | Efecto de "máquina de escribir" en 40 líneas |
| `vueisotope` + Masonry | CSS Grid | El layout de proyectos ya no necesita JavaScript |
| `vue-scrollto` | Directiva propia `v-scroll-to` | `scrollIntoView({ behavior: 'smooth' })` |
| `vue-router`, `vuex`, `bootstrap-vue` | Nada | Estaban instalados pero no se usaban |

La última fila es la más importante: **la mitad de las dependencias de un proyecto viejo no se usan**. Antes de migrar algo, comprueba que realmente se importa en algún componente.

## Vite en lugar de Webpack 3

El toolchain original (Webpack 3 + Babel 6) rompía en Node 17 o superior por cambios en OpenSSL. Migrar Webpack de la versión 3 a la 5 era casi tanto trabajo como cambiar a Vite, así que fui directo a Vite:

```js
// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  base: './', // rutas relativas para GitHub Pages
  plugins: [vue()],
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } }
})
```

El resultado: `vite build` termina en unos segundos, con 240 kB de JavaScript y 306 kB de CSS. El CSS sigue siendo grande porque la plantilla original carga Bootstrap 3 completo; reducirlo es la siguiente fase.

## Despliegue automático

Con Vite, publicar fue lo más sencillo: un workflow de GitHub Actions instala dependencias, ejecuta `npm run build` y sube `dist/` a GitHub Pages en cada push a `master`. La carpeta `dist/` dejó de estar en git.

## Lo que queda pendiente

- Trasladar el SCSS de la plantilla al pipeline de Vite y eliminar el CSS que no se usa.
- Sustituir las fuentes de iconos (FontAwesome, Themify) por SVG inline.
- Auditoría con Lighthouse: rendimiento, accesibilidad y SEO.

## Preguntas frecuentes

### ¿Conviene migrar a Vue 3 o reescribir con otro framework?

Si el diseño y los componentes siguen valiendo, migrar es más barato: Vue 3 mantiene la Options API y la mayoría del código se mueve sin cambios. Reescribir solo tiene sentido si el diseño también va a cambiar.

### ¿Cuánto tiempo llevó la migración?

Las fases 0 a 3 (seguridad, limpieza, Vue 3 + Vite y reemplazo de dependencias) se completaron en pocas sesiones de trabajo repartidas en unos días, porque el plan estaba escrito de antemano y cada tarea era pequeña.

### ¿Qué hago con una API key que quedó en el historial de git?

Rotarla. Borrarla del código actual no sirve de nada si el repositorio es público: cualquiera puede leer los commits antiguos. Genera una nueva clave y restríngela por dominio (HTTP referrer) en la consola del proveedor.

### ¿Vale la pena mantener la Options API en Vue 3?

Para un proyecto migrado, sí. La Composition API es mejor para lógica compleja y reutilizable, pero cambiar componentes que ya funcionan solo por cambiar de estilo añade riesgo sin beneficio inmediato.

## Conclusión

Migrar un proyecto heredado no es una sola tarea grande sino muchas pequeñas: primero seguridad, luego limpieza, después el andamiaje y por último las dependencias. Escribir el plan en el repositorio y trabajar en una rama separada hizo que el proceso fuera predecible y que el sitio nunca se cayera.
