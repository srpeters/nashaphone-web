/* One behaviour only: fade-and-rise section entrances.
   Everything degrades to plain visible content if this file never runs,
   because .reveal only hides elements once the `js` class is present. */

(function () {
  "use strict";

  var targets = document.querySelectorAll(".reveal");
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

  function showAll() {
    for (var i = 0; i < targets.length; i++) {
      targets[i].classList.add("is-visible");
    }
  }

  if (reduced.matches || !("IntersectionObserver" in window)) {
    showAll();
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { rootMargin: "0px 0px -10% 0px", threshold: 0.05 });

  for (var i = 0; i < targets.length; i++) {
    observer.observe(targets[i]);
  }

  // Honour the setting if the visitor changes it mid-visit.
  if (typeof reduced.addEventListener === "function") {
    reduced.addEventListener("change", function (event) {
      if (event.matches) {
        observer.disconnect();
        showAll();
      }
    });
  }
})();
