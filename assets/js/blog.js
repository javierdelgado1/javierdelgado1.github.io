/* Blog de Javier Delgado — interacciones mínimas, sin dependencias.
   Replica lo que en el portafolio hacían App.vue / Header.vue / Others.vue / Loader.vue:
   loader, header que baja al cargar y se fija al hacer scroll, panel lateral móvil,
   botón flotante de compartir y "copiar enlace". */
(function () {
  "use strict";

  var body = document.body;
  var topBar = document.getElementById("top-bar");
  var loader = document.getElementById("page-loader");

  // ---- Loader + body.loaded (revela el header con su animación) ----
  function hideLoader() {
    if (loader) loader.classList.add("is-hidden");
  }
  function onLoaded() {
    body.classList.add("loaded");
    setTimeout(hideLoader, 300);
  }
  if (document.readyState === "complete") onLoaded();
  else window.addEventListener("load", onLoaded, { once: true });
  setTimeout(onLoaded, 2000); // por si el evento load tarda (fuentes, imágenes…)

  // ---- Header fijo al pasar la altura del top-bar (body.sticky-layout) ----
  var topBarHeight = topBar ? topBar.offsetHeight : 40;
  function setHeader() {
    body.classList.toggle("sticky-layout", (window.scrollY || document.documentElement.scrollTop) >= topBarHeight);
  }
  setHeader();
  window.addEventListener("scroll", setHeader, { passive: true });

  // ---- Panel lateral (menú móvil) ----
  var toggles = document.querySelectorAll(".panel-toggle");
  var panel = document.getElementById("panel");
  var backdrop = document.querySelector(".panel-backdrop");
  function setPanel(open) {
    body.classList.toggle("panel-open", open);
    Array.prototype.forEach.call(toggles, function (t) {
      t.setAttribute("aria-expanded", open ? "true" : "false");
      t.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
    });
  }
  Array.prototype.forEach.call(toggles, function (t) {
    t.addEventListener("click", function (e) {
      e.preventDefault();
      setPanel(!body.classList.contains("panel-open"));
    });
  });
  if (backdrop) backdrop.addEventListener("click", function () { setPanel(false); });
  if (panel) {
    Array.prototype.forEach.call(panel.querySelectorAll("a"), function (a) {
      a.addEventListener("click", function () { setPanel(false); });
    });
  }

  // ---- Botón flotante de compartir ----
  var share = document.getElementById("share-it");
  var shareBtn = share ? share.querySelector(".icon-share") : null;
  function setShare(open) {
    if (!share) return;
    share.classList.toggle("open", open);
    if (shareBtn) shareBtn.setAttribute("aria-expanded", open ? "true" : "false");
  }
  if (shareBtn) {
    shareBtn.addEventListener("click", function (e) {
      e.preventDefault();
      setShare(!share.classList.contains("open"));
    });
    document.addEventListener("click", function (e) {
      if (share.classList.contains("open") && !share.contains(e.target)) setShare(false);
    });
  }

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      setPanel(false);
      setShare(false);
    }
  });

  // ---- Copiar enlace ----
  Array.prototype.forEach.call(document.querySelectorAll(".copy-link"), function (btn) {
    btn.addEventListener("click", function () {
      var url = btn.getAttribute("data-url") || location.href;
      var hasText = btn.textContent.trim().length > 0;
      var original = btn.textContent;
      var done = function () {
        if (hasText) btn.textContent = "¡Copiado!";
        btn.classList.add("copied");
        btn.setAttribute("title", "Enlace copiado");
        setTimeout(function () {
          if (hasText) btn.textContent = original;
          btn.classList.remove("copied");
          btn.setAttribute("title", "Copiar enlace");
        }, 2000);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(done, done);
      } else {
        var ta = document.createElement("textarea");
        ta.value = url;
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand("copy"); } catch (_) {}
        document.body.removeChild(ta);
        done();
      }
    });
  });
})();
