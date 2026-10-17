/* Pages internes : filtre des projets, lightbox de la galerie, présélection de commission */
(function () {
  "use strict";
  // Filtre des projets par statut
  var fb = document.querySelectorAll("[data-filter]");
  fb.forEach(function (b) {
    b.addEventListener("click", function () {
      fb.forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); });
      document.querySelectorAll("[data-status]").forEach(function (c) {
        c.hidden = b.dataset.filter !== "all" && c.dataset.status !== b.dataset.filter;
      });
    });
  });

  // Lightbox (élément <dialog> : focus et touche Échap gérés nativement)
  var dlg = document.getElementById("lb");
  var items = Array.prototype.slice.call(document.querySelectorAll("[data-lightbox]"));
  if (dlg && items.length && dlg.showModal) {
    var img = dlg.querySelector("img"), cap = dlg.querySelector(".lb-cap"), i = 0;
    function show(n) {
      i = (n + items.length) % items.length;
      var src = items[i].dataset.lightbox; img.src = src; img.alt = items[i].dataset.alt || ""; cap.textContent = items[i].dataset.caption || "";
    }
    items.forEach(function (it, n) { it.addEventListener("click", function () { show(n); dlg.showModal(); }); });
    dlg.querySelector(".pv").addEventListener("click", function () { show(i - 1); });
    dlg.querySelector(".nx").addEventListener("click", function () { show(i + 1); });
    dlg.querySelector(".x").addEventListener("click", function () { dlg.close(); });
    dlg.addEventListener("click", function (e) { if (e.target === dlg) dlg.close(); });
    dlg.addEventListener("keydown", function (e) { if (e.key === "ArrowLeft") show(i - 1); if (e.key === "ArrowRight") show(i + 1); });
  }

  // Adhésion : présélection de la commission via ?commission=Finances (liste blanche)
  var sel = document.getElementById("commission"), q = new URLSearchParams(location.search).get("commission");
  if (sel && q) Array.prototype.forEach.call(sel.options, function (o) { if (o.value === q) sel.value = q; });
})();
