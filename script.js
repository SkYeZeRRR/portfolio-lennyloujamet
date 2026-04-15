/* ============================================================
   script.js — Portfolio Lenny-Lou Jamet
   Modules : navigation mobile, validation formulaire, modals
   ============================================================ */

// ============================================================
// CONFIG
// ============================================================
// Remplacez par votre endpoint Formspree pour un envoi réel
// Exemple : 'https://formspree.io/f/votre-id'
const FORM_ENDPOINT = 'https://formspree.io/f/mldpkwao';

// ============================================================
// NAVIGATION MOBILE
// ============================================================
(function initNav() {
  const toggle = document.querySelector('.nav-toggle');
  const menu   = document.querySelector('.nav-menu');

  if (!toggle || !menu) return;

  toggle.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('active');
    toggle.setAttribute('aria-expanded', isOpen);
  });

  // Fermeture au clic sur un lien (mobile)
  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        menu.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  });
})();

// ============================================================
// FORMULAIRE DE CONTACT
// ============================================================
(function initForm() {
  const form    = document.getElementById('contactForm');
  const success = document.getElementById('form-success');
  const error   = document.getElementById('form-error');

  if (!form) return;

  const nom     = document.getElementById('nom');
  const email   = document.getElementById('email');
  const message = document.getElementById('message');

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Validation individuelle d'un champ
  function validate(field, isValid, msg) {
    const errEl = document.getElementById(`${field.id}-error`);
    if (!isValid(field.value.trim())) {
      field.classList.add('error');
      errEl.textContent = msg;
      return false;
    }
    field.classList.remove('error');
    errEl.textContent = '';
    return true;
  }

  // Validation en temps réel (au blur)
  nom.addEventListener('blur', () =>
    validate(nom, v => v.length >= 2, 'Le nom doit contenir au moins 2 caractères'));

  email.addEventListener('blur', () =>
    validate(email, v => EMAIL_RE.test(v), 'Adresse email invalide'));

  message.addEventListener('blur', () =>
    validate(message, v => v.length >= 10, 'Le message doit contenir au moins 10 caractères'));

  // Soumission
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    success.style.display = 'none';
    error.style.display   = 'none';

    const okNom  = validate(nom,     v => v.length >= 2,       'Le nom doit contenir au moins 2 caractères');
    const okMail = validate(email,   v => EMAIL_RE.test(v),    'Adresse email invalide');
    const okMsg  = validate(message, v => v.length >= 10,      'Le message doit contenir au moins 10 caractères');

    if (!okNom || !okMail || !okMsg) return;

    const btn  = form.querySelector('button[type="submit"]');
    const orig = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Envoi…';

    try {
      if (FORM_ENDPOINT) {
        const res = await fetch(FORM_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({
            nom:     nom.value.trim(),
            email:   email.value.trim(),
            message: message.value.trim()
          })
        });
        if (!res.ok) throw new Error('Erreur serveur');
      } else {
        // Mode simulation
        await new Promise(r => setTimeout(r, 800));
      }

      success.style.display = 'block';
      form.reset();
      success.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    } catch (err) {
      console.error('Envoi échoué :', err);
      error.style.display = 'block';
      error.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } finally {
      btn.disabled    = false;
      btn.textContent = orig;
    }
  });
})();

// ============================================================
// FERMETURE MODALS AU CLIC EXTÉRIEUR
// ============================================================
document.querySelectorAll('.modal').forEach(modal => {
  modal.addEventListener('click', (e) => {
    if (e.target === modal) window.location.hash = '';
  });
});

// ============================================================
// OMBRE NAVBAR AU SCROLL
// ============================================================
(function initScrollShadow() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    navbar.style.boxShadow = window.pageYOffset > 40
      ? '0 2px 20px rgba(0,0,0,0.4)'
      : '';
  }, { passive: true });
})();
