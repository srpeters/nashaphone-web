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

  /* ---- enquiry form: real submission via fetch ----
     Without JavaScript the form posts natively to the same endpoint, so
     the no-JS path still delivers. Validation here never replaces the
     server side: the endpoint and the required attributes both stand. */

  var form = document.getElementById("enquiry");
  if (!form) return;

  var FALLBACK =
    'No hemos podido enviar el mensaje. Escríbanos directamente a ' +
    '<a href="mailto:comercial@nashaphone.es">comercial@nashaphone.es</a> ' +
    'o llame al <a href="tel:+34645935546">+34 645 93 55 46</a>.';

  var statusBox = document.getElementById("form-status");
  var submitBtn = document.getElementById("enquiry-submit");

  function setStatus(message, kind) {
    statusBox.innerHTML = message;
    statusBox.className = "form-status" + (kind ? " form-status--" + kind : "");
    statusBox.hidden = false;
  }

  function setError(inputId, errorId, message) {
    var input = document.getElementById(inputId);
    var box = document.getElementById(errorId);
    if (message) {
      input.setAttribute("aria-invalid", "true");
      box.textContent = message;
      box.hidden = false;
    } else {
      input.removeAttribute("aria-invalid");
      box.textContent = "";
      box.hidden = true;
    }
  }

  function validate() {
    var problems = [];
    var name = form.elements["nombre"];
    var mail = form.elements["correo"];
    var consent = form.elements["consentimiento"];

    setError("f-name", "e-name", "");
    setError("f-email", "e-email", "");
    setError("f-consent", "e-consent", "");

    if (!name.value.trim()) {
      setError("f-name", "e-name", "Indique su nombre.");
      problems.push(name);
    }
    if (!mail.value.trim()) {
      setError("f-email", "e-email", "Indique su correo electrónico.");
      problems.push(mail);
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(mail.value.trim())) {
      setError("f-email", "e-email", "Ese correo no parece válido. Revíselo.");
      problems.push(mail);
    }
    if (!consent.checked) {
      setError("f-consent", "e-consent",
        "Debe aceptar la política de privacidad para poder enviar la solicitud.");
      problems.push(consent);
    }
    return problems;
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    // Honeypot: a person cannot tick a field they cannot see or reach.
    if (form.elements["botcheck"] && form.elements["botcheck"].checked) {
      setStatus("Mensaje enviado. Le responderemos en breve.", "ok");
      return;
    }

    var problems = validate();
    if (problems.length) {
      problems[0].focus();
      setStatus("Revise los campos marcados antes de enviar.", "error");
      return;
    }

    var key = form.elements["access_key"].value;
    if (!key || key.indexOf("PEGAR-AQUI") === 0) {
      // Not wired up yet: say so instead of failing silently.
      setStatus(FALLBACK, "error");
      return;
    }

    var payload = {};
    new FormData(form).forEach(function (value, field) { payload[field] = value; });

    submitBtn.disabled = true;
    var original = submitBtn.textContent;
    submitBtn.textContent = "Enviando…";
    setStatus("Enviando…");

    fetch(form.action, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload)
    })
      .then(function (response) { return response.json().catch(function () { return {}; }); })
      .then(function (data) {
        if (data && data.success) {
          form.reset();
          setStatus("Mensaje enviado. Le responderemos en breve.", "ok");
        } else {
          setStatus(FALLBACK, "error");
        }
      })
      .catch(function () { setStatus(FALLBACK, "error"); })
      .finally(function () {
        submitBtn.disabled = false;
        submitBtn.textContent = original;
      });
  });

  // Clear a field's error as soon as the visitor fixes it.
  ["f-name", "f-email", "f-consent"].forEach(function (id) {
    var el = document.getElementById(id);
    if (!el) return;
    el.addEventListener("input", function () {
      if (el.getAttribute("aria-invalid")) validate();
    });
    el.addEventListener("change", function () {
      if (el.getAttribute("aria-invalid")) validate();
    });
  });
})();
