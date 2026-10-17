/* Formulaire d'adhésion : validation, envoi et confirmation honnête.
   La confirmation n'est affichée que si le serveur répond { ok: true }. */
(function (root) {
  'use strict';
  var COMMISSIONS = [
    'Communication',
    'Organisation',
    'Finances',
    'Mobilisation',
  ];

  function trimText(value) {
    return String(value == null ? '' : value).replace(/\s+/g, ' ').trim();
  }

  function sanitizeEmail(value) {
    return trimText(value).toLowerCase();
  }

  function normalizeCommission(value) {
    var c = trimText(value);
    return COMMISSIONS.indexOf(c) !== -1 ? c : '';
  }

  function validate(v) {
    var e = {};
    var nom = trimText(v.nom);
    if (!nom || nom.length < 3)
      e.nom = 'Indiquez votre nom et prénom (3 caractères minimum).';
    else if (!/^[A-Za-zÀ-ÖØ-öø-ÿ0-9' .\-]{3,80}$/.test(nom))
      e.nom = 'Utilisez uniquement des lettres, chiffres, espaces et ponctuations simples.';

    var digits = (v.telephone || '').replace(/[\s.\-()]/g, '');
    if (!/^\+?\d{8,15}$/.test(digits))
      e.telephone = 'Indiquez un numéro valide, par exemple 77 000 00 00.';

    var email = sanitizeEmail(v.email);
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email))
      e.email = "Cette adresse e-mail n'est pas valide.";

    var commission = normalizeCommission(v.commission);
    if (v.commission && !commission)
      e.commission = 'Commission invalide.';

    var motivation = trimText(v.motivation);
    if (motivation.length > 800)
      e.motivation = '800 caractères maximum.';
    if (!v.consent)
      e.consent =
        'Votre consentement est nécessaire pour traiter votre demande.';
    return e;
  }

  // Retourne "ok" (enregistrement confirmé), "unconfirmed" (réponse illisible) ou "error" (échec réseau/serveur)
  function send(payload, cfg, fetchImpl) {
    var ctrl =
      typeof AbortController !== 'undefined' ? new AbortController() : null;
    var timer = setTimeout(function () {
      if (ctrl) ctrl.abort();
    }, cfg.TIMEOUT_MS || 15000);
    return fetchImpl(cfg.ADHESION_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8', Accept: 'application/json' }, // requête « simple » : pas de pré-vérification CORS
      body: JSON.stringify(payload),
      signal: ctrl ? ctrl.signal : undefined,
      credentials: 'omit',
      cache: 'no-store',
    })
      .then(function (res) {
        clearTimeout(timer);
        if (!res.ok) return 'error';
        return res.json().then(
          function (j) {
            return j && j.ok === true ? 'ok' : 'unconfirmed';
          },
          function () {
            return 'unconfirmed';
          },
        );
      })
      .catch(function () {
        clearTimeout(timer);
        return 'error';
      });
  }

  root.AlaForm = { validate: validate, send: send };

  if (typeof document === 'undefined' || !document.getElementById) return;
  var form = document.getElementById('adhesion-form');
  if (!form) return;
  var cfg = root.ALA_CONFIG || {};
  var box = document.getElementById('form-status');
  var btn = form.querySelector('button[type=submit]');

  function val(id) {
    var el = form.elements[id];
    return el ? (el.type === 'checkbox' ? el.checked : el.value) : '';
  }
  function show(kind, html) {
    box.className = 'status ' + kind;
    box.innerHTML = html;
    box.hidden = false;
    box.focus();
  }

  form.addEventListener('submit', function (ev) {
    ev.preventDefault();
    var v = {
      nom: val('nom'),
      telephone: val('telephone'),
      email: val('email'),
      commission: val('commission'),
      motivation: val('motivation'),
      consent: val('consent'),
    };
    var errs = validate(v),
      first = null;
    [
      'nom',
      'telephone',
      'email',
      'commission',
      'motivation',
      'consent',
    ].forEach(function (k) {
      var p = document.getElementById('err-' + k),
        el = form.elements[k];
      p.textContent = errs[k] || '';
      el.setAttribute('aria-invalid', errs[k] ? 'true' : 'false');
      if (errs[k] && !first) first = el;
    });
    if (first) {
      first.focus();
      return;
    }
    if (val('website')) return; // champ piège anti-robots : on ignore silencieusement
    if (!cfg.ADHESION_ENDPOINT) {
      show(
        'warn',
        "L'envoi en ligne n'est pas encore activé. Écrivez-nous : <a href=\"mailto:" +
          cfg.EMAIL +
          '">' +
          cfg.EMAIL +
          '</a>.',
      );
      return;
    }
    btn.disabled = true;
    btn.textContent = 'Envoi en cours…';
    send(
      {
        nom: v.nom.trim(),
        telephone: v.telephone.trim(),
        email: v.email.trim(),
        commission: normalizeCommission(v.commission),
        motivation: v.motivation.trim(),
        consent: true,
        source: 'site-adhesion',
      },
      cfg,
      root.fetch.bind(root),
    ).then(function (r) {
      btn.disabled = false;
      btn.textContent = 'Envoyer ma demande';
      var wa = 'https://wa.me/' + cfg.WHATSAPP;
      if (r === 'ok') {
        show(
          'ok',
          "Merci ! Votre demande d'adhésion a bien été enregistrée. Un responsable vous contactera.",
        );
        form.reset();
      } else if (r === 'unconfirmed')
        show(
          'warn',
          "Nous n'avons pas pu confirmer l'enregistrement de votre demande. Pour être sûr(e) qu'elle nous parvient, écrivez-nous sur <a href=\"" +
            wa +
            '">WhatsApp</a> ou à <a href="mailto:' +
            cfg.EMAIL +
            '">' +
            cfg.EMAIL +
            '</a>.',
        );
      else
        show(
          'warn',
          'L\'envoi a échoué (connexion ou serveur). Vos informations sont conservées dans le formulaire : réessayez, ou contactez-nous sur <a href="' +
            wa +
            '">WhatsApp</a>.',
        );
    });
  });
})(typeof window !== 'undefined' ? window : globalThis);
