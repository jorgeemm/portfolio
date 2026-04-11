/* ════════════════════════════════════════════════════
   gallery.js — proyectos.html
════════════════════════════════════════════════════ */

/* ──────────────────────────────────────────────
   0. AUTO ASPECT-RATIO para .gcard
   Lee naturalWidth/naturalHeight del <img class="gcard-img">
   y aplica aspect-ratio al .gcard padre.
   Si la imagen falla, queda el emoji de fondo visible.
────────────────────────────────────────────── */
(function () {
  function applyRatio(card, img) {
    const w = img.naturalWidth;
    const h = img.naturalHeight;
    if (!w || !h) return;
    card.style.aspectRatio = w + ' / ' + h;
  }

  document.querySelectorAll('.gcard').forEach(card => {
    const img = card.querySelector('.gcard-img');
    if (!img) return;
    if (img.complete && img.naturalWidth) {
      applyRatio(card, img);
    } else {
      img.addEventListener('load',  () => applyRatio(card, img), { once: true });
      img.addEventListener('error', () => { img.style.opacity = '0'; }, { once: true });
      window.addEventListener('resize', () => applyRatio(card, img), { passive: true });
    }
  });
})();


/* ──────────────────────────────────────────────
   1. FILTROS
────────────────────────────────────────────── */
(function () {
  const btns  = document.querySelectorAll('.filter-btn');
  const items = document.querySelectorAll('.gallery-item');
  if (!btns.length) return;

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;

      // activo visual
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // mostrar/ocultar con animación
      items.forEach(item => {
        const tags = (item.dataset.tags || '').split(',').map(t => t.trim());
        const show = filter === 'todos' || tags.includes(filter);

        if (show) {
          item.classList.remove('hidden');
          item.style.animation = 'fadeIn 0.35s ease forwards';
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });
})();


/* ──────────────────────────────────────────────
   2. FADE-IN animation keyframes (inyectado por JS)
────────────────────────────────────────────── */
(function () {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to   { opacity: 1; transform: translateY(0); }
    }
  `;
  document.head.appendChild(style);
})();


/* ──────────────────────────────────────────────
   3. NAVBAR shadow on scroll
────────────────────────────────────────────── */
(function () {
  const nav = document.querySelector('.navbar');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    nav.style.boxShadow = window.scrollY > 10
      ? '0 2px 16px rgba(0,0,0,0.1)'
      : 'none';
  }, { passive: true });
})();


/* ──────────────────────────────────────────────
   Aleatorización del orden de las cards en +proyectos
   ────────────────────────────────────────────── */
(function () {
  const grid = document.getElementById('gallery-grid');
  if (!grid) return;
  const items = Array.from(grid.querySelectorAll('.gallery-item'));
  // Mezcla con algoritmo Fisher-Yates
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    grid.appendChild(items[j]);
    items.splice(j, 1);
  }
})();