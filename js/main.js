/* Africa's Light — comportements de la page d'accueil (JS natif, sans dépendance) */
(function () {
  'use strict';
  var root = document.documentElement;
  root.classList.add('js');

  var header = document.querySelector('.site-header');
  var btn = document.querySelector('.menu-btn');
  var nav = document.getElementById('nav');
  var bar = document.querySelector('.progress');

  // Menu mobile : ouverture, fermeture (Échap, clic sur un lien), état ARIA
  function setMenu(open) {
    document.body.classList.toggle('nav-open', open);
    btn.setAttribute('aria-expanded', String(open));
    btn.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
  }
  if (btn && nav) {
    btn.addEventListener('click', function () {
      setMenu(!document.body.classList.contains('nav-open'));
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) setMenu(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && document.body.classList.contains('nav-open')) {
        setMenu(false);
        btn.focus();
      }
    });
  }

  // Header compact + barre de progression (une seule écoute, throttlée par rAF)
  var ticking = false;
  function onScroll() {
    var y = window.scrollY;
    header.classList.toggle('is-scrolled', y > 40);
    var max = root.scrollHeight - window.innerHeight;
    bar.style.setProperty('--p', max > 0 ? Math.min(y / max, 1) : 0);
    ticking = false;
  }
  window.addEventListener(
    'scroll',
    function () {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(onScroll);
      }
    },
    { passive: true },
  );
  onScroll();

  // Révélations au défilement
  var items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            en.target.classList.add('is-visible');
            io.unobserve(en.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -6% 0px' },
    );
    items.forEach(function (el) {
      io.observe(el);
    });
  } else {
    items.forEach(function (el) {
      el.classList.add('is-visible');
    });
  }
})();
