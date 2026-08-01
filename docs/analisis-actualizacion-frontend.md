# Informe de análisis y actualización del frontend

**Proyecto:** `miportafolio` (javierdelgado1.github.io)
**Fecha del informe:** 2026-08-01
**Rama:** `master`
**Último commit:** 2026-08-01

## Resumen ejecutivo

El portafolio es una aplicación **Vue 2 + Webpack 3** originalmente derivada de un
template ("I'm Mat - Material Personal Resume vCard Template"). El stack base
tiene los años contados: **Vue 2 llegó a fin de vida (EOL) el 31 de diciembre de
2023** y ya no recibe parches de seguridad; el toolchain (Webpack 3, Babel 6,
Node 12) está dos o tres generaciones por detrás. Además, el repositorio público
contiene riesgos de seguridad concretos (API key de Google Maps expuesta,
formulario PHP vulnerable, jQuery 1.x) y bastante código muerto heredado del
template original.

Este informe detalla, por orden de urgencia, qué actualizar y una ruta de
migración recomendada.

---

## Estado actual del proyecto

### `package.json` (dependencias instaladas)

| Dependencia | Versión | Estado |
|---|---|---|
| `vue` | 2.7.16 | **EOL** (Vue 2 fuera de soporte desde 2023) |
| `webpack` | 3.6.0 | Obsoleto (actual: 5.x) |
| `webpack-dev-server` | 2.9.1 | Obsoleto (actual: 5.x) |
| `babel-core` | 6.26.3 | Pre-Babel 7 |
| `babel-loader` | 7.1.5 | Obsoleto |
| `babel-preset-env` | 1.7.0 | Sustituido por `@babel/preset-env` |
| `babel-preset-stage-3` | 6.24.1 | Deprecado |
| `vue-loader` | 13.7.3 | Obsoleto (actual: 17.x para Vue 3) |
| `css-loader` | 0.28.11 | Obsoleto |
| `file-loader` | 1.1.11 | Deprecado → `asset modules` de Webpack 5 |
| `cross-env` | 5.2.1 | Muy viejo |
| `bootstrap-vue` | 2.23.1 | Solo Vue 2 |
| `vue-router` | 3.6.5 | Vue 2 (Vue 3 usa `vue-router@4`) |
| `vuex` | 3.6.2 | Vue 2 (Vue 3 usa Pinia) |
| `vue-carousel` | 0.6.15 | Mantenimiento mínimo |
| `vue-gallery` | 1.5.0 | Abandonado |
| `vue-multilanguage` | 3.0.5 | Sin mantenimiento |
| `vue-progress-bar` | 1.0.1 | Muy viejo |
| `vue-progress-path` | 0.0.2 | Muy viejo |
| `vue-typer` | 1.2.0 | No compatible Vue 3 |
| `vueisotope` | 3.1.2 | Licencia/uso complicado |
| `vue-scrollto` | 2.20.0 | Reemplazable por API nativa |

### Entorno

- **Node:** `12.22.12` (`.nvmrc`) — **EOL desde abril 2022**. Mínimo recomendado: Node 20 LTS (idealmente Node 22).
- **Babel config** (`.babelrc`): `presets: env, stage-3` (Babel 6).
- **Browserslist:** `"> 1%", "last 2 versions", "not ie <= 8"` — irrelevante (IE está muerto).

### Estructura relevante

```
src/
├── main.js                      # Bootstrap de Vue 2 + plugins
├── vue-multilanguage.js
├── components/
│   ├── App.vue                  # Layout raíz
│   ├── global.js                # eventBus + URL del backend
│   ├── data.js                  # Exporta secciones desde db.json
│   ├── layouts/                 # Loader, Header, Others
│   └── sections/                # Home, About, Skill, Works, Contact...
├── assets/
│   ├── data/db.json             # Datos del portafolio
│   ├── api/twitter/             # API v1.1 de Twitter (muerta)
│   ├── php/contact-form.php     # Formulario PHP vulnerable
│   ├── fonts/                   # FontAwesome + themity (fuentes de iconos)
│   ├── css/ y sass/             # Temas por color
│   └── img/
├── index.html                   # Template original "I'm Mat" (muerto)
└── project-example.html          # Template original (muerto)
```

---

## Hallazgos por orden de urgencia

### 🔴 Crítico — Seguridad

#### 1. API key de Google Maps expuesta y commiteada
**Archivo:** `index.html`
```html
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBBxocflC-NifhJlVxDPXKo732RgWtEIE0"></script>
```
La clave está en un repositorio público (GitHub Pages). Cualquiera puede usarla y
consumir tu cuota. Adicionalmente, está dentro del HTML servido al cliente, así
que es visible en el navegador.

**Acción:**
- Rotar (revocar y crear nueva) la clave en Google Cloud Console.
- Restringir la nueva clave por **referrer HTTP** (dominio del portfolio) y/o por
  IP. Una clave restringida, aunque se filtre, no es utilizable fuera del dominio.
- Si no se usa el mapa, eliminar el `<script>` por completo.
- Nunca commitear claves: mover a variable de entorno o inyectarlas en build.

#### 2. Formulario de contacto PHP vulnerable
**Archivo:** `src/assets/php/contact-form.php`
```php
$name = trim($_POST['name']);
$email = trim($_POST['email']);
...
$headers = 'From: '.$email."\r\n" . 'Reply-To: '.$email."\r\n";
mail($emailTo, $subject, $body, $headers);
```
Problemas:
- **Sin saneado/validación** de los campos `$_POST`.
- **Email header injection**: el `From:`/`Reply-To:` se construye con input del
  usuario. Un atacante puede inyectar cabeceras adicionales y usar el servidor
  como relay de spam.
- `mail()` nativo sin librería (PHPMailer / similar).
- `$emailTo` sigue siendo `'example@mail.com'` (placeholder sin reemplazar).

**Acción:** Si el formulario no se usa, **eliminarlo**. Si se usa, reescribir con
validación estricta de email y una librería de correo robusta (PHPMailer con
SMTP autenticado). Hoy en día lo más razonable para un portafolio estático es
un servicio de formularios (Formspree, Resend, etc.) y eliminar PHP del repo.

#### 3. API de Twitter/X legada (muerta)
**Directorio:** `src/assets/api/twitter/` (incluye `twitteroauth`, `tweet.php`,
`config.php`)

Usa la **API v1.1 de Twitter, que dejó de funcionar** tras el cambio a X.
Toda la carpeta es código muerto.

**Acción:** Eliminar el directorio completo.

#### 4. jQuery 1.12.3 cargado globalmente
**Archivo:** `index.html`
```html
<script src="src/assets/js/jquery-1.12.3.min.js"></script>
<script src="src/assets/js/plugins.js"></script>
<script src="src/assets/js/core.js"></script>
```
jQuery 1.x tiene vulnerabilidades conocidas (XSS vía `$.parseHTML`,
`$.htmlPrefilter`, etc.). En un sitio construido con Vue no debería existir
jQuery: el DOM lo maneja Vue. `plugins.js` y `core.js` probablemente dependan del
template original.

**Acción:** Auditar qué de `plugins.js`/`core.js` se usa realmente y reemplazarlo
con código Vue o APIs nativas; eliminar jQuery.

---

### 🟠 Stack obsoleto — Migración principal

#### 5. Vue 2 → Vue 3
Vue 2 está fuera de soporte desde el 31/12/2023. Sin parches de seguridad, sin
compatibilidad con el ecosistema moderno. Vue 3 trae Composition API, `<script setup>`,
mejor rendimiento y tree-shaking. La sintaxis de plantilla es muy parecida, por
lo que los componentes `.vue` migran con esfuerzo moderado.

#### 6. Webpack 3 → Vite
Webpack 3 (2017) no soporta ES modules nativos, su HMR es lento, usa
`UglifyJsPlugin` (sin mantenimiento) y obliga a mantener Babel 6. Vite
reemplaza webpack + babel + vue-loader con un setup de ~5 líneas y un dev
server con HMR prácticamente instantáneo. El `webpack.config.js` actual
incluye patrones obsoletos (`'vue$'` alias, `LoaderOptionsPlugin`, sourcemaps
con `#source-map`).

#### 7. Babel 6 → eliminar o Babel 7+
Con un target de Node moderno y Vite, normalmente **no se necesita Babel** para
un portafolio. Elimina `babel-core`, `babel-preset-env`, `babel-preset-stage-3`.

#### 8. Dependencias de Vue 2 sin equivalente directo en Vue 3
| Paquete actual | Sustitución recomendada (Vue 3) |
|---|---|
| `bootstrap-vue` | `bootstrap-vue-3`, o Bootstrap nativo |
| `vue-carousel` | `@splidejs/vue-splide` |
| `vue-gallery` | `vue-easy-lightbox` / lightbox nativo |
| `vue-multilanguage` | `vue-i18n` (estándar) |
| `vue-progress-bar` / `vue-progress-path` | CSS nativo o componente propio |
| `vue-typer` | `vue-typewriter` / efecto typer propio |
| `vueisotope` (Isotope) | Layout con CSS Grid (sin dependencia) |
| `vue-scrollto` | `Element.scrollIntoView()` nativo |
| `vuex` | **Pinia** |
| `vue-router@3` | `vue-router@4` |

#### 9. Node 12 → Node 20/22 LTS
Node 12 está EOL desde abril 2022. Actualizar `.nvmrc` a `20` (o `22`) y
verificar que el nuevo toolchain (Vite) corra sin problemas.

---

### 🟡 Mantenimiento / Limpieza

#### 10. Artefactos de build commiteados
- `dist/build.js` y `dist/build.js.map` están trackeados en git (aparecen
  modificados en `git status`).
- `dist.zip` y `src.zip` están sin trackear pero viven en el repo.
- `.gitignore` ya ignora `dist/`, pero los archivos viejos quedaron trackeados
  desde antes.

**Acción:** `git rm -r --cached dist/`, eliminar los `.zip`, y desplegar a
GitHub Pages mediante una **GitHub Action** que compile (`vite build`) y
publique, sin commitear el resultado.

#### 11. Templates originales muertos
- `src/index.html` y `src/project-example.html` son el template "I'm Mat"
  original, con título y comentarios ajenos.

**Acción:** Eliminar. El HTML de entrada real es `index.html` de la raíz.

#### 12. URLs hardcodeadas a `javierdelgado.com.ve`
**Archivo:** `src/components/App.vue`
```html
<img src="https://javierdelgado.com.ve/apps/portfolio/src/assets/img/photos/bg_frontend.jpg">
<img src="https://javierdelgado.com.ve/apps/portfolio/src/assets/img/avatars/avatar.jpg">
```
Si el dominio o la ruta cambian, las imágenes se rompen.

**Acción:** Centralizar rutas de assets en `data`/config o importar los assets
para que el bundler los gestione.

#### 13. Iconos como fuentes pesadas
`src/assets/fonts/` contiene `font-awesome` y `themify` descargados como
archivos de fuente (.ttf, .eot, .woff, .svg). Las fuentes de iconos cargan
gliflos completos, incluyendo los que no se usan.

**Acción:** Migrar a **iconos SVG** (inline o una librería como
`lucide-vue-next` o Font Awesome via npm con tree-shaking).

#### 14. Google Fonts y meta tags antiguos
`index.html` usa `<meta http-equiv="Content-Type">` y `type="text/css"` en los
`<link>` de fuentes, patrones heredados.

**Acción:** Modernizar a `@font-face`/`@import` o `preload`, eliminar atributos
obsoletos.

#### 15. `browserslist` irrelevante
La regla `not ie <= 8` ya no tiene sentido. Se puede simplificar a
`defaults` o `last 2 versions`.

---

## ✅ Lo que está bien y se debe conservar

- **Datos separados en JSON** (`src/assets/data/db.json` + `data.js`): buena
  base para evolucionar hacia headless/CMS. Reutilizable en la migración.
- **Componentes por sección** (`Home`, `About`, `Skill`, `Works`,
  `Contact`...): estructura limpia que migra directamente a Vue 3.
- **Theming por color en SCSS** (`src/assets/sass/theme-*.scss`): patrón que
  se traslada sin esfuerzo a la nueva configuración.
- Uso de **`eventBus`** (`global.js`) — en Vue 3 se sustituye por
  `mitt`/Pinia, pero la idea central se conserva.

---

## Ruta de migración recomendada

Dado que es un portafolio personal estático, lo más pragmático es **reescribir
el andamiaje** (no migrar pieza por pieza el toolchain) manteniendo la lógica de
los componentes.

1. **Subir Node a 20/22 LTS** y actualizar `.nvmrc`.
2. **Andamiaje nuevo:** `npm create vite@latest` con template Vue + TS (opcional).
3. **Migrar componentes `.vue`** a Vue 3 con `<script setup>` (sintaxis muy
   parecida). Reaprovechar `db.json` y `data.js`.
4. **Reemplazar librerías muertas:**
   - `vue-i18n` (i18n), Pinia (estado), `@splidejs/vue-splide` (carousel),
     iconos SVG/lucide.
5. **Seguridad inmediata (hacer ya, aunque se posponga la migración):**
   - Rotar y restringir la API key de Google Maps.
   - Eliminar `src/assets/php/contact-form.php` y `src/assets/api/twitter/`.
   - Eliminar jQuery y `plugins.js`/`core.js` si no se usan.
6. **Despliegue:** GitHub Action que ejecute `vite build` y publique en GitHub
   Pages; no commitear `dist/`.
7. **Limpieza:** borrar `src/index.html`, `src/project-example.html`, los
   `.zip` y los iconos en fuente.

---

## Acciones inmediatas sugeridas (prioridad 1)

Estas se pueden ejecutar **hoy** sin tocar el resto del stack:

1. **Rotar la API key de Google Maps** y restringirla por referrer (o eliminar
   el mapa si no se usa).
2. **Eliminar el formulario PHP** y la **API de Twitter** (código muerto/vulnerable).
3. **Quitar jQuery 1.12.3** y los scripts del template (`plugins.js`, `core.js`).
4. **Limpiar `dist/` del control de versiones** y los `.zip`.

Con eso se cierra el frente de seguridad y se reduce el ruido mientras se
planifica la migración a Vue 3 + Vite.