document.addEventListener("DOMContentLoaded", () => {

  // === LUCIOLES ALÉATOIRES (sécurisé si éléments absents) ===
  const lucioleIds = ['luciole1','luciole2','luciole3','luciole4','luciole5'];
  const lucioles = lucioleIds.map(id => document.getElementById(id)).filter(Boolean);

  if (lucioles.length > 0) {
    // Position et vitesse aléatoire
    const positions = lucioles.map(() => ({
      x: Math.random() * document.body.scrollWidth,
      y: Math.random() * document.body.scrollHeight,
      vx: (Math.random() - 0.5) * 1.5,
      vy: (Math.random() - 0.5) * 1.5
    }));

    function animateLucioles() {
      positions.forEach((pos, index) => {
        pos.x += pos.vx;
        pos.y += pos.vy;

        // Rebonds sur les bords du document entier
        if (pos.x < 0 || pos.x > document.body.scrollWidth - 12) pos.vx *= -1;
        if (pos.y < 0 || pos.y > document.body.scrollHeight - 12) pos.vy *= -1;

        // Appliquer la position
        const el = lucioles[index];
        if (el) {
          el.style.left = `${pos.x}px`;
          el.style.top = `${pos.y}px`;
        }
      });

      requestAnimationFrame(animateLucioles);
    }

    animateLucioles();
  }

  // === CARTE LEAFLET ===
  const map = L.map('map').setView([4.930552542951605, -52.29476863501056], 15);

  const lightMap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
    maxZoom: 20,
    attribution: '&copy; <a href="https://www.esri.com/">Esri</a>'
  });

  const darkMap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
    maxZoom: 20,
    attribution: '&copy; <a href="https://www.esri.com/">Esri</a> — Esri Dark Gray Canvas'
  });

  const body = document.body;
  const toggle = document.getElementById("theme-toggle");
  let currentLayer;

  function updateMapTheme() {
    if (currentLayer) map.removeLayer(currentLayer);
    if (body.classList.contains("dark")) {
      currentLayer = darkMap;
    } else {
      currentLayer = lightMap;
    }
    currentLayer.addTo(map);
  }

  updateMapTheme();

  // Marqueur
  L.marker([4.930552542951605, -52.29476863501056])
    .addTo(map)
    .bindPopup('<b>Maqroll Le Carbet</b><br>WPJ4+548, Chemin Saint-Antoine, Cayenne 97300, Guyane française')
    .openPopup();

  // === DARK MODE ===
  if (toggle) {
    if (localStorage.getItem("theme") === "dark") {
      body.classList.add("dark");
      toggle.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
      toggle.innerHTML = '<i class="fas fa-moon"></i>';
    }

    toggle.addEventListener("click", () => {
      body.classList.toggle("dark");
      const isDark = body.classList.contains("dark");
      toggle.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
      localStorage.setItem("theme", isDark ? "dark" : "light");

      setTimeout(updateMapTheme, 300); // mise à jour de la carte après changement de thème
    });
  }

  // === BURGER MENU ===
  const burger = document.getElementById("burger");
  const closeMenu = document.getElementById("close-menu");
  const nav = document.querySelector("nav");

  if (burger) {
    burger.addEventListener("click", () => {
      const isExpanded = burger.getAttribute('aria-expanded') === 'true';
      if (nav) nav.classList.toggle("active");
      // update aria
      burger.setAttribute('aria-expanded', String(!isExpanded));
      // prevent body scroll when menu open
      if (!isExpanded) {
        document.body.style.overflow = 'hidden';
        const firstLink = nav ? nav.querySelector('a') : null;
        if (firstLink) firstLink.focus();
      } else {
        document.body.style.overflow = '';
      }
    });
  }

  if (closeMenu) {
    closeMenu.addEventListener("click", () => {
      nav.classList.remove("active");
      burger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      burger.focus();
    });
  }

  document.querySelectorAll('nav ul li a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('active');
      burger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  // === GLASSMORPHISM HEADER ===
  const header = document.querySelector("header");
  window.addEventListener("scroll", () => {
    header.classList.toggle("scrolled", window.scrollY > 50);
  });


// --- SCOLL REVEAL GALERIE --- 
const galerieImages = document.querySelectorAll('.galerie-grid img');

const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible'); // ajoute la classe pour l'animation
      observer.unobserve(entry.target); // animation qu'une seule fois
    }
  });
}, { threshold: 0.1 });

galerieImages.forEach(img => observer.observe(img));



  // === SCROLL REVEAL ===
  const scrollElements = document.querySelectorAll(".scroll-reveal");

  const revealOnScroll = () => {
    scrollElements.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight - 50) el.classList.add("visible");
    });
  };

  window.addEventListener("scroll", revealOnScroll);
  window.addEventListener("load", revealOnScroll);
  revealOnScroll();

  // === SIMPLE CAROUSEL FOR .about-img-wrapper ===
  document.querySelectorAll('.about-img-wrapper').forEach(wrapper => {
    const imgs = Array.from(wrapper.querySelectorAll('img'));
    if (imgs.length <= 1) return; // nothing to do

    // build structure
    const track = document.createElement('div');
    track.className = 'carousel-track';

    imgs.forEach(img => {
      const slide = document.createElement('div');
      slide.className = 'carousel-slide';
      // ensure image has about-img class
      img.classList.add('about-img');
      slide.appendChild(img.cloneNode(true));
      track.appendChild(slide);
    });

    // clear wrapper and append track
    wrapper.innerHTML = '';
    wrapper.appendChild(track);

    // controls
    const controls = document.createElement('div');
    controls.className = 'carousel-controls';
    const prevBtn = document.createElement('button'); prevBtn.setAttribute('aria-label','Précédent'); prevBtn.innerHTML = '&#10094;';
    const nextBtn = document.createElement('button'); nextBtn.setAttribute('aria-label','Suivant'); nextBtn.innerHTML = '&#10095;';
    controls.appendChild(prevBtn); controls.appendChild(nextBtn);
    wrapper.appendChild(controls);

    // dots
    const dotsWrap = document.createElement('div'); dotsWrap.className = 'carousel-dots';
    imgs.forEach((_, i) => { const b = document.createElement('button'); if (i===0) b.classList.add('active'); b.dataset.index = i; dotsWrap.appendChild(b); });
    wrapper.appendChild(dotsWrap);

    let index = 0;
    const slides = track.querySelectorAll('.carousel-slide');
    const goTo = i => {
      index = (i + slides.length) % slides.length;
      track.style.transform = `translateX(-${index * 100}%)`;
      dotsWrap.querySelectorAll('button').forEach(b => b.classList.toggle('active', Number(b.dataset.index) === index));
    };

    // prettier SVG arrows
    prevBtn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    nextBtn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 6l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

    prevBtn.addEventListener('click', () => goTo(index - 1));
    nextBtn.addEventListener('click', () => goTo(index + 1));
    dotsWrap.addEventListener('click', e => { if (e.target.tagName === 'BUTTON') goTo(Number(e.target.dataset.index)); });

    // Touch / swipe support for mobile
    (function addTouchSupport() {
      let startX = 0;
      let currentX = 0;
      let isDragging = false;
      const threshold = 50; // px to trigger swipe

      const onStart = (e) => {
        const touch = e.touches ? e.touches[0] : e;
        startX = touch.clientX;
        startY = touch.clientY;
        currentX = startX;
        isDragging = true;
        track.style.transition = 'none';
      };

      const onMove = (e) => {
        if (!isDragging) return;
        const touch = e.touches ? e.touches[0] : e;
        currentX = touch.clientX;
        const currentY = touch.clientY;
        const dx = currentX - startX;
        const dy = Math.abs(currentY - startY);
        // if vertical movement is greater, allow page scroll
        if (dy > Math.abs(dx)) return;
        // prevent vertical scroll during horizontal drag
        if (e.cancelable) e.preventDefault();
        const pct = (dx / track.clientWidth) * 100;
        track.style.transform = `translateX(-${index * 100 - pct}%)`;
      };

      const onEnd = () => {
        if (!isDragging) return;
        isDragging = false;
        const delta = currentX - startX;
        track.style.transition = '';
        if (Math.abs(delta) > threshold) {
          if (delta > 0) goTo(index - 1);
          else goTo(index + 1);
        } else {
          goTo(index);
        }
      };

      // touch events
      track.addEventListener('touchstart', onStart, { passive: true });
      track.addEventListener('touchmove', onMove, { passive: false }); // we may call preventDefault
      track.addEventListener('touchend', onEnd);
      track.addEventListener('touchcancel', onEnd);

      // pointer/mouse fallback for desktop drag (optional)
      track.addEventListener('pointerdown', (e) => { e.preventDefault(); onStart(e); track.setPointerCapture(e.pointerId); });
      track.addEventListener('pointermove', onMove);
      track.addEventListener('pointerup', onEnd);
      track.addEventListener('pointercancel', onEnd);
    })();
  });
});
