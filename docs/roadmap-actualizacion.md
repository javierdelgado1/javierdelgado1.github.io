# Roadmap de actualización del portafolio

Lista de tareas por fases para modernizar el proyecto `miportafolio`.
Marca cada casilla `- [ ]` → `- [x]` conforme avances.

> Referencia detallada de cada punto: `docs/analisis-actualizacion-frontend.md`

---

## Fase 0 — Seguridad inmediata (hacer hoy, sin migrar el stack)

- [ ] Rotar la API key de Google Maps en Google Cloud Console — **manual (tú)**: la key se eliminó del working tree, pero sigue en el historial git público y debe rotarse en Google Cloud Console
- [ ] Restringir la nueva API key por referrer HTTP (dominio del portfolio) — **manual (tú)**
- [x] Eliminar el `<script>` de Google Maps de `index.html` si no se usa el mapa — el mapa solo estaba referenciado en un `div` comentado en `Contact.vue`
- [x] Eliminar `src/assets/php/contact-form.php` (formulario vulnerable) — el Vue posta a `global_url.url_contact` (backend externo), no al PHP
- [x] Eliminar `src/assets/api/twitter/` completo (API v1.1 muerta)
- [x] Auditar uso real de `src/assets/js/plugins.js` y `core.js` — **auditoría completa**: `plugins.js` es Bootstrap 3.3.6 (jQuery), `core.js` es el JS del template (118 usos de `$`); el formulario Vue (`Contact.vue`/`Others.vue`) usa `$().validate()` de jQuery Validate, así que jQuery NO es muerto
- [ ] Eliminar jQuery 1.12.3 (`src/assets/js/jquery-1.12.3.min.js`) y scripts del template no usados — **APLAZADO a Fase 2**: el uso de jQuery por parte de Vue (validación del formulario) ya se eliminó al quitar la sección de contacto; solo queda `core.js` (UI del template: panel toggle, ajax-modal, tooltips). Se elimina junto con `core.js` en la migración a Vue 3.
- [x] `git rm -r --cached dist/` (dejar de trackear artefactos de build) — `.gitignore` ya cubre `dist/`
- [x] Eliminar `dist.zip` y `src.zip` del directorio raíz

> **Nota jQuery:** originalmente `Contact.vue` y `Others.vue` usaban `@submit.prevent="onContact"` con `$('.validate-form').validate()` / `$('#contactForm').valid()` (jQuery + jQuery Validate de `plugins.js`). Al **eliminar por completo la sección de contacto** (decisión tomada durante la Fase 0), ese uso de jQuery desapareció. El único uso restante de jQuery es `core.js` (JS del template original) para UI del panel móvil (`data-toggle="panel"`, ajax-modal, tooltips) referenciado desde `Header.vue`. Ese código se reemplaza por Vue en la Fase 2.

> **Sección de contacto eliminada:** se removió por completo — `Contact.vue` borrado; formulario y nav de `Others.vue`/`Header.vue` limpiados; export `contact` de `data.js`; objeto `contact` y `menu.contact` de `db.json`; e i18n `contact`/`others.title_form`/`others.input_*` de `main.js`; y `global_url` de `global.js`. Build verificado OK. Esto deja la **Fase 4 (backend del formulario) obsoleta**.

## Fase 1 — Limpieza y preparación del entorno

- [ ] Actualizar Node a 20 LTS (o 22) y modificar `.nvmrc` — **APLAZADO a Fase 2**: el toolchain actual (Webpack 3 + Babel 6) rompe en Node 17+ (OpenSSL/md4, APIs deprecadas). Subir Node tiene sentido junto con el cambio a Vite. Disponible v24.18.0 en la máquina; `.nvmrc` se actualiza al migrar.
- [x] Actualizar `browserslist` a `defaults` / `last 2 versions` — cambiado a `["defaults"]` en `package.json`
- [x] Eliminar `src/index.html` (template original "I'm Mat")
- [x] Eliminar `src/project-example.html`
- [x] Revisar y eliminar imports/plugins de `src/main.js` que ya no apliquen — eliminado `import { VueTyper }` (sin uso; el plugin se registra vía `require('vue-typer').default`); `vue-carousel`/`vue-typer`/`vue-gallery`/`vueisotope`/`vue-progress` sí se usan en componentes
- [ ] Centralizar URLs hardcodeadas (`javierdelgado.com.ve`) en config/`data.js` — **APLAZADO a Fase 2/6**: las imágenes existen localmente en `src/assets/img/`, pero migrarlas al pipeline del bundler toca el `publicPath` y el despliegue (GitHub Pages). Se hace al rearmar assets con Vite y definir el despliegue.
- [ ] Migrar iconos de fuente (FontAwesome/themify) a SVG inline o `lucide-vue-next` — **APLAZADO a Fase 5**: requiere reemplazar cada `<i class="fa …">` / `<i class="ti-…">` en todas las plantillas; mejor hacerlo en la revisión de assets/estilos sobre Vue 3.
- [x] Modernizar Google Fonts y meta tags en `index.html` (quitar `http-equiv`, `type="text/css"`) — eliminado `<meta http-equiv>` redundante y `type='text/css'` de los `<link>` de fuentes

## Fase 2 — Migración del andamiaje (Vue 3 + Vite)

- [x] Actualizar Node a 20 LTS (o 22) y `.nvmrc` — `.nvmrc` = `20`, build ejecutado con Node 24
- [x] Eliminar jQuery + `core.js`/`plugins.js` de `index.html` — borrado todo `src/assets/js/` (jQuery, plugins, core, masonry, owl, isotope, etc.); `index.html` ya no carga scripts del template
- [ ] Centralizar URLs hardcodeadas (`javierdelgado.com.ve`) y migrar imágenes al pipeline del bundler — **APLAZADO a Fase 6** (requiere definir el despliegue/GitHub Pages `base`)
- [x] Crear proyecto Vite nuevo con template Vue en rama `migration/vue3`
- [x] Configurar Vite (alias `@`, `base: './'` para GitHub Pages) en `vite.config.js`
- [x] Mover configuración de alias y entry al nuevo `vite.config.js`
- [x] Trasladar `src/assets/data/db.json` y `data.js` (sin cambios)
- [x] Migrar `App.vue` a Vue 3 (Options API; modal de proyecto reactivo reemplaza ajax-modal jQuery)
- [x] Migrar componentes de `src/components/layouts/` (Loader, Header, Others)
- [x] Migrar componentes de `src/components/sections/` (Home, About, Skill, Works, Services, Pricing, Experience, Reference, LastestPost, PromoVideo, Certificates, Project)
- [x] Sustituir `eventBus` (`global.js`) por `mitt`
- [x] Verificar que el build de Vite compila sin errores — `vite build` verde (240 kB JS / 306 kB CSS), `vite preview` sirve HTTP 200

> **Verificación visual completada:** la app migrada carga en navegador, header y
> fondo visibles, i18n reacciona al cambiar idioma, modal de proyecto y carrusel
> funcionan. El toggle del panel móvil (`#panel`) y el header sticky on-scroll,
> que gestionaba `core.js` con jQuery, ya se reimplementaron en Vue (`Header.vue` /
> `Others.vue` / `App.vue`). Pendiente: el `v-scroll-to` no compensa el offset del
> header al navegar a una sección.

## Fase 3 — Reemplazo de dependencias de Vue 2

- [x] ~~`vue-router@3` → `vue-router@4`~~ — no aplica: `vue-router` no se usaba
- [x] ~~`vuex@3` → Pinia~~ — no aplica: `vuex` no se usaba
- [x] `vue-multilanguage` → `vue-i18n` (diccionarios `en`/`es` migrados a `src/i18n.js`; `v-lang.x.y` → `v-html="$t('x.y')"`; `language` como computed global reactivo)
- [x] `vue-carousel` → `@splidejs/vue-splide`
- [x] `vue-gallery` → `vue-easy-lightbox`
- [x] `vue-typer` → componente propio `src/components/Typer.vue` (registrado global como `<vue-typer>`)
- [x] ~~`vue-progress-bar` / `vue-progress-path`~~ — no aplica: no se usaban (Skill usa `.progress-bar` CSS nativo)
- [x] `vueisotope` (Isotope) + jQuery Masonry → CSS Grid en `Works.vue`
- [x] `vue-scrollto` → directiva propia `v-scroll-to` con `scrollIntoView` (`src/directives.js`)
- [x] ~~`bootstrap-vue`~~ — no aplica: no se usaba

## Fase 4 — Backend del formulario de contacto — ⚠️ OBSOLETO

> La sección de contacto se eliminó por completo en la Fase 0. Si en el futuro se
> quiere volver a tener un formulario, crear una nueva fase con una solución sin
> PHP (Formspree / Resend / Netlify Forms / endpoint serverless).

- [x] ~~Decidir alternativa sin PHP~~ — no aplica (sección eliminada)
- [x] ~~Implementar el formulario~~ — no aplica
- [x] ~~Validar campos en cliente~~ — no aplica
- [x] ~~Probar envío real~~ — no aplica

## Fase 5 — Estilos y assets

- [ ] Trasladar SCSS de `src/assets/sass/` al pipeline de Vite
- [ ] Conservar y verificar el theming por color (`theme-*.scss`)
- [ ] Eliminar CSS duplicado/obsoleto de `src/assets/css/` (animate.css viejo, owl.carousel, etc.)
- [ ] Optimizar imágenes (formato WebP/AVIF, lazy loading)
- [ ] Reemplazar `animate.css` 3.5.2 por versión moderna o animaciones CSS propias

## Fase 6 — Despliegue y CI/CD

- [ ] Crear GitHub Action que ejecute `vite build` en push a `master`
- [ ] Configurar publicación automática a GitHub Pages desde la Action
- [ ] Confirmar que `dist/` no se commitea (`.gitignore` correcto)
- [ ] Verificar favicon y meta tags (Open Graph, `lang`, viewport)
- [ ] Probar el sitio en el dominio final

## Fase 7 — Calidad y rendimiento

- [ ] Lighthouse audit (performance, accesibilidad, SEO, mejores prácticas)
- [ ] Lighthouse score objetivo: performance ≥ 90, accesibilidad ≥ 95
- [ ] Revisar y corregir contraste de color y atributos `alt` de imágenes
- [ ] Eliminar JavaScript/CSS no usado (coverage report)
- [ ] Code splitting / lazy load de secciones pesadas
- [ ] Verificar responsividad en móvil, tablet y escritorio
- [ ] Test de rotura de rutas y navegación

---

## Progreso general

- Fase 0 — Seguridad inmediata: `5/9` (restantes: 2 manuales de rotación de API key)
- Fase 1 — Limpieza y entorno: `5/8` (restantes: URL e iconos aplazados a Fase 5/6)
- Fase 2 — Migración Vue 3 + Vite: `11/12` (restante: URLs hardcodeadas → Fase 6; pendiente verificación visual)
- Fase 3 — Reemplazo de dependencias: `10/10` ✅
- Fase 4 — Backend formulario: `4/4` ✅ obsoleto (sección de contacto eliminada)
- Fase 5 — Estilos y assets: `0/5`
- Fase 6 — Despliegue y CI/CD: `0/6`
- Fase 7 — Calidad y rendimiento: `0/7`

> Total: **35/61 tareas completadas**

---

## Notas

- Avanza fase por fase; no hace falta terminar una fase al 100% antes de
  empezar la siguiente, pero **la Fase 0 (seguridad) sí conviene cerrarla primero**.
- Trabaja la migración en una rama separada (`migration/vue3`) para mantener
  el sitio actual funcionando en `master` mientras se estabiliza.
- Actualiza los contadores de "Progreso general" y los checkboxes conforme
  completes tareas.