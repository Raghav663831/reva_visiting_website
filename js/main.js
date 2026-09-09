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

  /* ---- Animated Counters (trigger once, never re-animate) ---- */
  const animatedStats = new Set();

  function triggerCounter(el) {
    if (animatedStats.has(el)) return;
    animatedStats.add(el);
    animateCounter(el);
    counterObserver.unobserve(el);
  }

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          triggerCounter(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  document.querySelectorAll('.stat__number').forEach((el) => {
    if (!animatedStats.has(el)) counterObserver.observe(el);
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

  /* ---- Accessible Modal System ---- */
  const modalFocusable = 'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';
  let activeModal = null;
  let lastFocused = null;

  function openDialog(modalEl) {
    if (!modalEl || modalEl.hidden === false) return;
    lastFocused = document.activeElement;
    modalEl.hidden = false;
    modalEl.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    activeModal = modalEl;
    const closeBtn = modalEl.querySelector('.modal__close');
    if (closeBtn) closeBtn.focus();
  }

  function closeDialog(modalEl) {
    if (!modalEl) return;
    modalEl.hidden = true;
    modalEl.setAttribute('aria-hidden', 'true');
    if (activeModal === modalEl) activeModal = null;
    const anyOpen = document.querySelectorAll('.modal:not([hidden])').length > 0;
    if (!anyOpen) document.body.style.overflow = '';
    if (lastFocused && lastFocused.isConnected) lastFocused.focus();
  }

  document.querySelectorAll('.modal').forEach((modal) => {
    modal.addEventListener('click', (e) => {
      if (e.target.closest('[data-modal-close]')) closeDialog(modal);
    });
  });

  document.addEventListener('keydown', (e) => {
    if (!activeModal) return;

    if (e.key === 'Escape') {
      closeDialog(activeModal);
      return;
    }

    if (e.key === 'Tab') {
      const focusables = activeModal.querySelectorAll(modalFocusable);
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });

  /* ---- Doctor Detail Profiles (in-page modal) ---- */
  const doctorModal = document.getElementById('doctorModal');
  const doctorModalContent = document.getElementById('doctorModalContent');

  const DOCTORS = {
    vikram: {
      name: 'Dr. Vikram Joshi',
      firstName: 'Dr. Joshi',
      role: 'Dermatopathologist & Skin Surgeon',
      specialty: 'Surgical & Procedural Dermatology',
      qualifications: 'MD, DNB',
      experience: '9+ years',
      photo: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=600&q=80&auto=format&fit=crop',
      alt: 'Dr. Vikram Joshi, Dermatopathologist and Skin Surgeon at REVA',
      bio: 'Dr. Vikram Joshi specializes in surgical and procedural dermatology, from mole and cyst removal to mole mapping and skin cancer screening. His dual training in dermatopathology ensures precise diagnosis and meticulous surgical outcomes with minimal scarring.',
      schedule: [
        { days: 'Monday', time: '12:00 PM – 7:00 PM' },
        { days: 'Thursday', time: '12:00 PM – 7:00 PM' },
        { days: 'Saturday', time: '10:00 AM – 3:00 PM' },
      ],
    },
    neha: {
      name: 'Dr. Neha Verma',
      firstName: 'Dr. Verma',
      role: 'Pediatric & Aesthetic Dermatologist',
      specialty: 'Pediatric Dermatology & Cosmetic Care',
      qualifications: 'MD, FAAD',
      experience: '8+ years',
      photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&q=80&auto=format&fit=crop',
      alt: 'Dr. Neha Verma, Pediatric and Aesthetic Dermatologist at REVA',
      bio: 'Dr. Neha Verma cares for delicate skin — from childhood eczema and birthmarks to teen acne. She pairs pediatric dermatology with subtle aesthetic treatments, earning the trust of families and young adults who value a gentle, unhurried approach.',
      schedule: [
        { days: 'Wednesday', time: '10:00 AM – 5:00 PM' },
        { days: 'Friday', time: '10:00 AM – 5:00 PM' },
        { days: 'Sunday', time: '10:00 AM – 2:00 PM' },
      ],
    },
  };

  const chipIcon = (type) => {
    if (type === 'cap') {
      return '<svg width="14" height="14" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M10 3L19 7l-9 4-9-4 9-4z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M5 9.5V13c0 1.4 2.2 2.5 5 2.5s5-1.1 5-2.5V9.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>';
    }
    if (type === 'clock') {
      return '<svg width="14" height="14" viewBox="0 0 20 20" fill="none" aria-hidden="true"><circle cx="10" cy="10" r="7" stroke="currentColor" stroke-width="1.5"/><path d="M10 6v4l2.5 2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>';
    }
    return '<svg width="14" height="14" viewBox="0 0 20 20" fill="none" aria-hidden="true"><circle cx="10" cy="10" r="7" stroke="currentColor" stroke-width="1.5"/><path d="M7.5 12.5l5-5M7.5 7.5h.01M12.5 12.5h.01" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>';
  };

  function renderDoctorProfile(doc) {
    return `
      <div class="doctor-profile__header">
        <img class="doctor-profile__photo" src="${doc.photo}" alt="${doc.alt}" loading="lazy">
        <div>
          <span class="doctor-profile__eyebrow">Specialist Profile</span>
          <h2 class="doctor-profile__name" id="doctorModalTitle">${doc.name}</h2>
          <p class="doctor-profile__role">${doc.role}</p>
          <div class="doctor-profile__meta">
            <span class="doctor-profile__chip">${chipIcon('cap')}${doc.qualifications}</span>
            <span class="doctor-profile__chip">${chipIcon('clock')}${doc.experience} experience</span>
            <span class="doctor-profile__chip">${chipIcon('doc')}${doc.specialty}</span>
          </div>
        </div>
      </div>
      <div class="doctor-profile__section">
        <h3>About</h3>
        <p class="doctor-profile__bio">${doc.bio}</p>
      </div>
      <div class="doctor-profile__section">
        <h3>Available Appointment Times</h3>
        <ul class="doctor-profile__schedule">
          ${doc.schedule.map((s) => `<li><strong>${s.days}</strong><span>${s.time}</span></li>`).join('')}
        </ul>
      </div>
      <div class="doctor-profile__actions">
        <a href="contact.html" class="btn btn--primary">Book with ${doc.firstName}</a>
        <a href="contact.html" class="btn btn--ghost">Ask a Question</a>
      </div>`;
  }

  if (doctorModal && doctorModalContent) {
    document.querySelectorAll('[data-doctor-open]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const profile = DOCTORS[btn.dataset.doctorOpen];
        if (!profile) return;
        doctorModalContent.innerHTML = renderDoctorProfile(profile);
        openDialog(doctorModal);
      });
    });
  }

  /* ---- Book a Free Consultation — Chat Platform Selector ---- */
  const chatModal = document.getElementById('chatModal');
  const chatToggle = document.getElementById('chatConsultationBtn');

  chatToggle?.addEventListener('click', () => openDialog(chatModal));

  if (chatModal) {
    chatModal.querySelectorAll('.chat-option').forEach((option) => {
      option.addEventListener('click', () => {
        closeDialog(chatModal);
      });
    });
  }

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
