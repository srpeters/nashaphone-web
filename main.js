/* Three behaviours, all progressive enhancements:
   1. staggered scroll reveals
   2. header blur once the page is scrolled
   3. mobile nav toggle
   4. the enquiry form composes a mailto: so it works without a backend
   Nothing here is required to read the page: .reveal only hides content
   once the `js` class is on <html>. */

(function () {
  "use strict";

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

  /* ---- scroll reveals, staggered per group ---- */

  var targets = document.querySelectorAll(".reveal");

  function showAll() {
    for (var i = 0; i < targets.length; i++) targets[i].classList.add("is-visible");
  }

  if (reduced.matches || !("IntersectionObserver" in window)) {
    showAll();
  } else {
    var observer = new IntersectionObserver(function (entries) {
      var shown = 0;
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.style.setProperty("--delay", (shown % 5) * 70 + "ms");
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
        shown++;
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.04 });

    for (var j = 0; j < targets.length; j++) observer.observe(targets[j]);

    if (typeof reduced.addEventListener === "function") {
      reduced.addEventListener("change", function (e) {
        if (e.matches) { observer.disconnect(); showAll(); }
      });
    }
  }

  /* ---- header blur on scroll ---- */

  var header = document.querySelector(".site-header");
  var ticking = false;

  function onScroll() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
      ticking = false;
    });
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---- mobile nav ---- */

  var toggle = document.querySelector(".nav-toggle");
  var mobileNav = document.getElementById("mobile-nav");

  if (toggle && mobileNav) {
    toggle.addEventListener("click", function () {
      var open = mobileNav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
    });
    mobileNav.addEventListener("click", function (event) {
      if (event.target.tagName === "A") {
        mobileNav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Abrir menú");
      }
    });
  }

  /* ---- enquiry form -> mailto, so it works with no backend ---- */

  var form = document.getElementById("enquiry");

  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var get = function (name) {
        var field = form.elements[name];
        return field && field.value ? field.value.trim() : "";
      };
      var body = [
        "Nombre: " + get("nombre"),
        "Empresa: " + get("empresa"),
        "Correo: " + get("correo"),
        "",
        get("mensaje")
      ].join("\n");

      window.location.href =
        "mailto:comercial@nashaphone.es" +
        "?subject=" + encodeURIComponent("Solicitud de listado de referencias") +
        "&body=" + encodeURIComponent(body);
    });
  }
})();
