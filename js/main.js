/**
 * REVA Skin & Hair Clinic — Main JavaScript
 * Handles scroll animations, parallax, carousel, counters, and navigation.
 */

(function () {
  'use strict';

  const navbar = document.getElementById('navbar');
  const heroBg = document.getElementById('heroBg');
  const heroOverlay = document.querySelector('.hero__overlay');
  const isHomePage = document.body.dataset.page === 'home';

  /* ---- Sticky Navbar ---- */
  function updateNavbar() {
    if (!navbar) return;
    const scrolled = window.scrollY > 60;
    navbar.classList.toggle('navbar--scrolled', scrolled || !isHomePage);
  }

  /* ---- Hero Parallax & Fade ---- */
  function updateHeroParallax() {
    if (!heroBg) return;
    const scrollY = window.scrollY;
    const heroHeight = document.querySelector('.hero')?.offsetHeight || window.innerHeight;
    const progress = Math.min(scrollY / heroHeight, 1);

    heroBg.style.transform = `translateY(${scrollY * 0.35}px)`;
    if (heroOverlay) {
      heroOverlay.style.opacity = 0.82 + progress * 0.18;
    }
  }

  /* ---- Mobile Nav ---- */
  function toggleNav() {
    const navMenu = document.getElementById('navMenu');
    const navToggle = document.getElementById('navToggle');
    if (!navMenu || !navToggle) return;
    const isOpen = navMenu.classList.toggle('open');
    navToggle.classList.toggle('active', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  function closeNav() {
    const navMenu = document.getElementById('navMenu');
    const navToggle = document.getElementById('navToggle');
    if (!navMenu || !navToggle) return;
    navMenu.classList.remove('open');
    navToggle.classList.remove('active');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  function bindNavEvents() {
    const toggle = document.getElementById('navToggle');
    const menu = document.getElementById('navMenu');
    toggle?.addEventListener('click', toggleNav);
    menu?.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', closeNav);
    });
  }

  /* ---- Smooth Scroll (with offset for fixed nav) ---- */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (!targetId || targetId === '#') return;
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    });
  });

  /* ---- Active Nav Link (page-based, set in layout.js) ---- */
  function updateActiveNavLink() {
    /* Active state is set server-side via layout.js aria-current on each page */
  }

  /* ---- Intersection Observer: Reveal Animations ---- */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .fade-up').forEach((el) => {
    revealObserver.observe(el);
  });

  /* ---- Animated Counters ---- */
  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  document.querySelectorAll('.stat__number').forEach((el) => counterObserver.observe(el));

  /* Re-animate stats every time cursor hovers */
  document.querySelectorAll('.stat').forEach((stat) => {
    const numEl = stat.querySelector('.stat__number');
    if (!numEl) return;

    stat.addEventListener('mouseenter', () => {
      const target = parseFloat(numEl.dataset.target);
      const suffix = numEl.dataset.suffix || '';
      const isDecimal = numEl.dataset.decimal === 'true';
      numEl.textContent = isDecimal ? '0.0' + suffix : '0' + suffix;
      stat.classList.add('is-counting');
      animateCounter(numEl, () => stat.classList.remove('is-counting'));
    });
  });

  function animateCounter(el, onComplete) {
    const target = parseFloat(el.dataset.target);
    const suffix = el.dataset.suffix || '';
    const isDecimal = el.dataset.decimal === 'true';
    const duration = 2000;
    const start = performance.now();

    function easeOutQuart(t) {
      return 1 - Math.pow(1 - t, 4);
    }

    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const raw = easeOutQuart(progress) * target;
      const value = isDecimal ? raw.toFixed(1) : Math.round(raw).toLocaleString();
      el.textContent = value + suffix;
      if (progress < 1) {
        requestAnimationFrame(tick);
      } else if (onComplete) {
        onComplete();
      }
    }

    requestAnimationFrame(tick);
  }

  /* ---- Horizontal Gallery: Scroll-triggered Before/After ---- */
  const galleryScroll = document.getElementById('galleryScroll');
  const galleryProgress = document.getElementById('galleryProgress');
  const gallerySlides = document.querySelectorAll('.gallery__slide');

  function updateGalleryScroll() {
    if (!galleryScroll) return;

    const scrollLeft = galleryScroll.scrollLeft;
    const maxScroll = galleryScroll.scrollWidth - galleryScroll.clientWidth;
    const progress = maxScroll > 0 ? scrollLeft / maxScroll : 0;

    if (galleryProgress) {
      galleryProgress.style.width = `${progress * 100}%`;
    }

    gallerySlides.forEach((slide) => {
      const slideLeft = slide.offsetLeft - galleryScroll.offsetLeft;
      const slideCenter = slideLeft + slide.offsetWidth / 2;
      const viewportCenter = scrollLeft + galleryScroll.clientWidth / 2;
      const distance = Math.abs(slideCenter - viewportCenter);
      const threshold = slide.offsetWidth * 0.4;

      slide.classList.toggle('show-after', distance < threshold);
    });
  }

  galleryScroll?.addEventListener('scroll', updateGalleryScroll, { passive: true });

  /* ---- Vertical Gallery: Scroll-linked Crossfade ---- */
  const galleryVertical = document.getElementById('galleryVertical');
  const verticalImages = document.querySelectorAll('.gallery__vertical-img');
  const verticalSteps = document.querySelectorAll('.gallery__step');
  const totalSteps = verticalImages.length;

  function updateVerticalGallery() {
    if (!galleryVertical || totalSteps === 0) return;

    const rect = galleryVertical.getBoundingClientRect();
    const sectionHeight = galleryVertical.offsetHeight;
    const viewportHeight = window.innerHeight;

    const start = viewportHeight * 0.3;
    const end = -(sectionHeight - viewportHeight * 0.7);
    const progress = Math.max(0, Math.min(1, (start - rect.top) / (start - end)));
    const stepIndex = Math.min(Math.floor(progress * totalSteps), totalSteps - 1);

    verticalImages.forEach((img, i) => {
      img.classList.toggle('active', i === stepIndex);
    });
    verticalSteps.forEach((step, i) => {
      step.classList.toggle('active', i === stepIndex);
    });
  }

  /* ---- Testimonials Carousel ---- */
  const track = document.getElementById('testimonialTrack');
  const prevBtn = document.getElementById('testimonialPrev');
  const nextBtn = document.getElementById('testimonialNext');
  const dotsContainer = document.getElementById('testimonialDots');
  const testimonials = track?.querySelectorAll('.testimonial') || [];
  let currentSlide = 0;
  let autoPlayTimer;

  function createDots() {
    if (!dotsContainer) return;
    testimonials.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'testimonials__dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('role', 'tab');
      dot.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
      dot.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
      dot.addEventListener('click', () => goToSlide(i));
      dotsContainer.appendChild(dot);
    });
  }

  function goToSlide(index) {
    currentSlide = ((index % testimonials.length) + testimonials.length) % testimonials.length;
    if (track) {
      track.style.transform = `translateX(-${currentSlide * 100}%)`;
    }
    dotsContainer?.querySelectorAll('.testimonials__dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === currentSlide);
      dot.setAttribute('aria-selected', i === currentSlide ? 'true' : 'false');
    });
  }

  function nextSlide() {
    goToSlide(currentSlide + 1);
  }

  function prevSlide() {
    goToSlide(currentSlide - 1);
  }

  function startAutoPlay() {
    stopAutoPlay();
    autoPlayTimer = setInterval(nextSlide, 5000);
  }

  function stopAutoPlay() {
    if (autoPlayTimer) clearInterval(autoPlayTimer);
  }

  prevBtn?.addEventListener('click', () => { prevSlide(); startAutoPlay(); });
  nextBtn?.addEventListener('click', () => { nextSlide(); startAutoPlay(); });
  track?.addEventListener('mouseenter', stopAutoPlay);
  track?.addEventListener('mouseleave', startAutoPlay);

  /* Touch swipe for carousel */
  let touchStartX = 0;
  track?.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  track?.addEventListener('touchend', (e) => {
    const diff = touchStartX - e.changedTouches[0].screenX;
    if (Math.abs(diff) > 50) {
      diff > 0 ? nextSlide() : prevSlide();
      startAutoPlay();
    }
  }, { passive: true });

  /* ---- Contact Form ---- */
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');

  contactForm?.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = contactForm.querySelector('#name');
    const email = contactForm.querySelector('#email');
    const phone = contactForm.querySelector('#phone');
    const service = contactForm.querySelector('#service');

    let valid = true;
    [name, email, phone, service].forEach((field) => {
      if (!field.value.trim()) {
        field.style.borderColor = '#e53e3e';
        valid = false;
      } else {
        field.style.borderColor = '';
      }
    });

    if (!valid) return;

    formSuccess.hidden = false;
    contactForm.reset();
    formSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    setTimeout(() => {
      formSuccess.hidden = true;
    }, 6000);
  });

  /* ---- Scroll Handler (throttled via rAF) ---- */
  let ticking = false;

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        updateNavbar();
        updateHeroParallax();
        updateActiveNavLink();
        updateVerticalGallery();
        ticking = false;
      });
      ticking = true;
    }
  }

  /* ---- Init ---- */
  function init() {
    bindNavEvents();
    updateNavbar();
    updateHeroParallax();
    updateGalleryScroll();
    updateVerticalGallery();
    createDots();
    startAutoPlay();

    if (isHomePage) {
      setTimeout(() => {
        document.querySelectorAll('.hero .fade-up').forEach((el) => {
          el.classList.add('visible');
        });
      }, 200);
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', () => {
    updateGalleryScroll();
    updateVerticalGallery();
  }, { passive: true });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
