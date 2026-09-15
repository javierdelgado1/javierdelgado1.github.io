---
title: 5 problemas de seguridad que encontré al revisar un frontend de hace diez años
description: Al retomar un proyecto web de 2016 encontré claves expuestas, un formulario PHP vulnerable y APIs muertas. Esta es la lista de lo que revisar antes de tocar una sola línea de código nuevo.
date: 2026-09-06
category: Seguridad
tags: [seguridad, git, frontend, mantenimiento]
cover: /assets/img/cover-seguridad.jpg
coverAlt: Candado sobre un teclado de computadora
author: Javier Delgado
translationKey: legacy-frontend-security
keyPoints:
  - Una clave de API en el código de un repositorio público sigue expuesta aunque la borres; hay que rotarla.
  - El código "que ya no se usa" (formularios PHP, integraciones viejas) sigue siendo alcanzable y explotable en el servidor.
  - Versionar artefactos de build y archivos zip esconde dependencias viejas y secretos dentro del repositorio.
  - Antes de auditar una dependencia, comprueba si de verdad se importa; muchas no.
  - Una revisión de seguridad de un proyecto heredado se hace en una tarde y no requiere migrar nada.
---

Cuando decidí modernizar mi portafolio, lo primero que hice no fue elegir un framework sino leer el repositorio con ojos de atacante. En un proyecto de 2016 que se fue parcheando durante años, encontré cinco problemas que son muy comunes en cualquier frontend heredado. Los cuento con la solución que apliqué en cada caso.

## 1. Una clave de API en el HTML

En el `index.html` había un `<script>` de Google Maps con la clave de API escrita en la URL. El mapa ni siquiera se mostraba: el `div` que lo contenía estaba comentado. Pero la clave seguía ahí, en un repositorio público, disponible para cualquiera.

**Lo que hice**: borrar el script. **Lo que hay que hacer además**: rotar la clave. Eliminarla del código no basta, porque el historial de git conserva cada versión anterior del archivo. La nueva clave debe restringirse por dominio (HTTP referrer) para que solo funcione desde el sitio.

> Regla práctica: si un secreto tocó alguna vez un commit público, está comprometido. Rótalo.

## 2. Un formulario de contacto en PHP que nadie usaba

El proyecto incluía `contact-form.php`, el script que traía la plantilla original para enviar correos. El componente Vue de contacto ya enviaba los datos a otro servicio, así que el PHP no se usaba… pero seguía desplegado y era alcanzable por URL.

Un script así, sin validación ni límite de envíos, es un relay de spam listo para usar. **Lo que hice**: eliminarlo y, ya puestos, eliminar toda la sección de contacto, que era la única razón para cargar jQuery Validate.

## 3. Una integración con una API muerta

Había una carpeta `api/twitter/` con código para la API v1.1 de Twitter, cerrada hace años, con su archivo de configuración para tokens. Código muerto no da errores, así que nadie lo revisa; pero cualquier archivo PHP servible es superficie de ataque y cualquier archivo de configuración es un candidato a filtrar credenciales.

**Lo que hice**: borrar la carpeta completa. Si algún día vuelve a hacer falta, está en el historial de git.

## 4. Artefactos de build y zips dentro del repositorio

La carpeta `dist/` (el resultado compilado) estaba versionada, junto con un `dist.zip` y un `src.zip`. Tres copias del proyecto, cada una con sus propias versiones de dependencias y potencialmente con secretos ya "borrados" del código fuente.

**Lo que hice**: `git rm -r --cached dist/`, borrar los zips y comprobar que `.gitignore` los excluye. El despliegue debe generar el build, no leerlo del repositorio.

## 5. jQuery 1.12 y una auditoría que sorprendió

jQuery 1.12 tiene vulnerabilidades conocidas y ya no recibe parches. La reacción obvia es "quitarlo", pero primero conviene saber quién lo usa. La auditoría dio un resultado curioso: de todo el código, **solo el script de la plantilla (`core.js`) y la validación del formulario** dependían de jQuery. Los componentes Vue no.

Al eliminar la sección de contacto (punto 2), el único uso restante quedó en `core.js`, que se reemplazó por comportamiento Vue durante la migración. La lección: antes de auditar o reemplazar una dependencia, mide su uso real; muchas veces es más pequeño de lo que parece.

## Una lista para tu próximo proyecto heredado

Si vas a retomar un frontend viejo, esta revisión cabe en una tarde:

| Qué buscar | Cómo | Qué hacer |
| --- | --- | --- |
| Claves y tokens en el código | `git log -p` y búsqueda de `key=`, `token`, `secret` | Rotar y restringir |
| Scripts de servidor (PHP, CGI) | Listar archivos ejecutables desplegados | Eliminar los que no se usan |
| Integraciones con APIs cerradas | Revisar carpetas `api/`, `lib/`, `vendor/` | Borrar |
| Artefactos versionados | `dist/`, `build/`, `*.zip` en `git ls-files` | Sacar de git |
| Dependencias obsoletas | `npm audit` y buscar los `import` reales | Reemplazar solo las que se usan |

## Preguntas frecuentes

### ¿De verdad hay que rotar una clave que ya borré del código?

Sí. En un repositorio público cualquiera puede recuperar la versión anterior del archivo con `git log -p`. Incluso en repositorios privados, los clones y forks conservan el historial.

### ¿Cómo sé si un archivo PHP viejo sigue siendo accesible?

Si está dentro de la carpeta pública del hosting (`public_html` o equivalente), es accesible por URL aunque nada lo enlace. Bórralo o muévelo fuera de la carpeta pública.

### ¿Sirve `npm audit` para un proyecto de 2016?

Sirve como inventario, pero producirá cientos de avisos, muchos de dependencias que no se usan. Prioriza las que realmente se importan en el código y las que se ejecutan en el servidor.

## Conclusión

Ninguno de estos cinco problemas requería migrar el proyecto para resolverse. Se corrigieron antes de tocar Vue, en una rama aparte y con commits pequeños. Empezar por la seguridad hace que la migración posterior sea más simple, porque hay menos código que mover, y garantiza que el esfuerzo valga la pena aunque el proyecto se quede a medias.
