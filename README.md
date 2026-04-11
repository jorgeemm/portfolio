# Portfolio · Jorge Martín Marcos

Página personal / portfolio. Construida en HTML + CSS + JS vanilla.

---

## Estructura de archivos

```
portfolio/
├── index.html              ← Página principal (Sobre mí + Proyectos destacados)
├── pages/
│   ├── proyectos.html      ← Galería completa de proyectos con filtros
│   └── cv.html             ← CV incrustado + descarga
├── css/
│   ├── style.css           ← Estilos de index.html
│   └── pages.css           ← Estilos compartidos (proyectos + cv)
├── js/
│   ├── main.js             ← Scripts del index
│   └── gallery.js          ← Scripts de proyectos (filtros, animaciones)
└── assets/
    ├── cv-jorge-martin-marcos.pdf   
    └── proyectos             
        ├── proyecto1.png
        ├── proyecto2.png
        └── ...
```

---

## Añadir una card en **Proyectos Destacados** (index.html)

Para incluir un video, el <img class="card-img"> se sustituye por <video class="card-img" autoplay loop muted playsinline></video>

**Importante** cerrar el bloque de video, que si no no se ve el overly.


```html
<article class="card"
  data-img="assets/mi-imagen.jpg"
  data-w="420"
  data-title="Título del proyecto"
  data-desc="Descripción breve."
  data-link="https://enlace-al-proyecto.com"
  style="background-color:#1a1a3e;">
  <img class="card-img" src="assets/mi-imagen.jpg" alt="Título del proyecto">
  <div class="card-overlay">
    <h3 class="card-hover-title">Título del proyecto</h3>
    <p class="card-hover-desc">Descripción breve.</p>
    <a class="card-hover-link" href="https://enlace-al-proyecto.com" target="_blank">Ver proyecto →</a>
  </div>
  <div class="card-placeholder-content"><span>📊</span></div>
</article>
```

- **`src`**: ruta a tu imagen. El JS lee `naturalWidth/naturalHeight` y aplica el `aspect-ratio` real.
- **`data-w`**: ancho base en desktop (px). Si se omite, usa 380px.
- **`background-color`**: color mientras carga, o si la imagen no existe.
- El emoji en `.card-placeholder-content` aparece si la imagen no carga.

---

## Añadir una card en **+Proyectos** (proyectos.html)


```html
    <div class="gallery-item" data-tags="x">
      <div class="gcard" style="background-color:#1a1a3e;">
        <img class="gcard-img" src="/assets/proyectos/" alt="xx">
        <div class="gcard-placeholder">📊</div>
        <div class="gcard-overlay">
          <p class="gcard-hover-desc">texto-hoover</p>
          <a class="gcard-hover-link" href="#" target="_blank">Ver noticia →</a>
        </div>
      </div>
      <div class="gcard-footer">
        <p class="gcard-footer-title">Título</p>
        <div class="gcard-tags">
          <span class="gcard-tag">xx</span>

        </div>
      </div>
    </div>
```

Las proporciones de la imagen se aplican automáticamente. No hay que especificar ningún ratio.

**Categorías de filtro **: deben coincidir con los botones `.filter-btn` del HTML

Para añadir una nueva categoría:
1. Añadir un botón `<button class="filter-btn" data-filter="nueva-cat">Nueva categoría</button>` en `proyectos.html`.
2. Incluír `nueva-cat` en el `data-tags` de las cards correspondientes.

---

### Barras de habilidades (index.html)

Dentro de `.skill-item` se cambia `data-level` (0–100):

```html
<div class="skill-bar-fill" data-level="85"></div>  <!-- 85% de relleno -->
```
