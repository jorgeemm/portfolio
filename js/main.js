/* ════════════════════════════════════════════════════
   JORGE MARTÍN MARCOS — main.js  (index)
════════════════════════════════════════════════════ */

/* ──────────────────────────────────────────────
   0. AUTO ASPECT-RATIO desde proporciones reales de imagen
   ─────────────────────────────────────────────
   Lee naturalWidth/naturalHeight de cada <img class="card-img">
   y aplica width + aspect-ratio al <article class="card"> padre.
   Si la imagen falla, oculta el <img> y deja el emoji visible.
   data-w en el article controla el ancho base desktop (px).
────────────────────────────────────────────── */
(function () {
  function applyRatio(card, img) {
    const w = img.naturalWidth  || img.videoWidth;
    const h = img.naturalHeight || img.videoHeight;
    if (!w || !h) return;
    if (window.innerWidth >= 900) {
      const desktopW = parseInt(card.dataset.w, 10) || 380;
      card.style.width = desktopW + 'px';
    } else {
      card.style.width = '';  // deja que el CSS del media query tome el control
    }
    card.style.aspectRatio = w + ' / ' + h;
  }

  document.querySelectorAll('.card').forEach(card => {
    const img = card.querySelector('.card-img, video');
    if (!img) return;
    const isVideo = img.tagName === 'VIDEO';
    const ready   = isVideo ? img.videoWidth : img.naturalWidth;
    if ((img.complete || ready) && ready) {
      applyRatio(card, img);
    } else {
      const ev = isVideo ? 'loadedmetadata' : 'load';
      img.addEventListener(ev,     () => applyRatio(card, img), { once: true });
      img.addEventListener('error', () => { img.style.opacity = '0'; }, { once: true });
      window.addEventListener('resize', () => applyRatio(card, img), { passive: true });
    }
  });
})();


/* ──────────────────────────────────────────────
   1. STICKY HORIZONTAL SCROLL (proyectos)
   Desktop: scroll vertical → mueve las tarjetas horizontalmente.
   Móvil (< 900 px): JS completamente desactivado, se usa
   overflow-x: scroll nativo con touch/swipe (ver CSS).
────────────────────────────────────────────── */
(function () {
  const wrapper = document.getElementById('sticky-scroll-wrapper');
  const inner   = document.getElementById('sticky-scroll-inner');
  const track   = document.getElementById('cards-track');
  if (!wrapper || !track) return;

  let rafId = null;
  let scrollHandler = null;

  function isMobile() { return window.innerWidth < 900; }

  function enableDesktopScroll() {
    const navH = 56; // alto de la navbar

    const maxTranslate = () => Math.max(0, track.scrollWidth - window.innerWidth + 80);

    // La altura del wrapper debe ser exactamente:
    // lo que ocupa el sticky (viewport - navbar) + distancia horizontal a recorrer
    function setWrapperHeight() {
      const viewH = window.innerHeight - navH;
      wrapper.style.height = viewH + maxTranslate() + 'px';
    }
    setWrapperHeight();

    scrollHandler = function () {
      if (isMobile()) return;

      const wrapperTop = wrapper.getBoundingClientRect().top;
      const navH       = 56;

      // Antes de que el sticky se ancle: sin transformar
      if (wrapperTop > navH) {
        track.style.transform = 'translateX(0)';
        return;
      }

      // Cuánto ha scrolleado el usuario DESDE que el sticky se ancló
      const scrolledSinceAnchor = -(wrapperTop - navH);
      const max = maxTranslate();
      const tx  = -Math.min(scrolledSinceAnchor, max);
      track.style.transform = `translateX(${tx}px)`;
    };

    window.addEventListener('scroll', scrollHandler, { passive: true });
    window.addEventListener('resize', () => { setWrapperHeight(); scrollHandler(); });
    scrollHandler();
  }

  function disableDesktopScroll() {
    if (scrollHandler) {
      window.removeEventListener('scroll', scrollHandler);
      scrollHandler = null;
    }
    // Reset transform y height para que el CSS de móvil tome el control
    track.style.transform = '';
    wrapper.style.height  = '';
  }

  function init() {
    if (isMobile()) {
      disableDesktopScroll();
    } else {
      enableDesktopScroll();
    }
  }

  init();

  // Reevaluar al rotar/redimensionar
  let lastMobile = isMobile();
  window.addEventListener('resize', () => {
    const nowMobile = isMobile();
    if (nowMobile !== lastMobile) {
      lastMobile = nowMobile;
      if (nowMobile) {
        disableDesktopScroll();
      } else {
        enableDesktopScroll();
      }
    }
  });
})();


/* ──────────────────────────────────────────────
   2. BARRAS DE HABILIDADES — animación en viewport
────────────────────────────────────────────── */
(function () {
  const fills = document.querySelectorAll('.skill-bar-fill');
  if (!fills.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const level = e.target.dataset.level || 0;
        e.target.style.width = level + '%';
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });

  fills.forEach(f => io.observe(f));
})();


/* ──────────────────────────────────────────────
   3. HIGHLIGHT DINÁMICO — subrayado de color
────────────────────────────────────────────── */
(function () {
  const words = document.querySelectorAll('.highlight-word');
  if (!words.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const idx = Array.from(words).indexOf(e.target);
        setTimeout(() => {
          e.target.classList.add('is-visible');
        }, 100 * idx);
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.6 });

  words.forEach(w => io.observe(w));
})();


/* ──────────────────────────────────────────────
   4. DESPLEGABLE
────────────────────────────────────────────── */
(function () {
  const btn     = document.getElementById('expandable-btn');
  const content = document.getElementById('expandable-content');
  if (!btn || !content) return;

  btn.addEventListener('click', () => {
    const expanded = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', String(!expanded));
    content.classList.toggle('open', !expanded);
  });
})();


/* ──────────────────────────────────────────────
   5. NAVBAR — shadow on scroll
────────────────────────────────────────────── */
(function () {
  const nav = document.getElementById('navbar');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    nav.style.boxShadow = window.scrollY > 10
      ? '0 2px 16px rgba(0,0,0,0.1)'
      : 'none';
  }, { passive: true });
})();


/* ──────────────────────────────────────────────
   6. ICONO EMAIL — copia al portapapeles + toast
   Para cambiar el email: modifica data-email="…"
   en el botón .social-icon--email del HTML.
────────────────────────────────────────────── */
(function () {
  const btn   = document.querySelector('.social-icon--email');
  const toast = document.getElementById('email-toast');
  if (!btn || !toast) return;

  let toastTimer = null;

  btn.addEventListener('click', () => {
    const email = btn.dataset.email || '';
    if (!email) return;

    // Mostrar el email en el toast
    toast.textContent = '✓ Copiado: ' + email;

    // Copiar al portapapeles
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(email).catch(() => fallbackCopy(email));
    } else {
      fallbackCopy(email);
    }

    // Mostrar y ocultar el toast
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2800);
  });

  function fallbackCopy(text) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.cssText = 'position:fixed;top:-9999px;left:-9999px;opacity:0';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
  }
})();