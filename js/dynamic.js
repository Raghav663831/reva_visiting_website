/**
 * Dynamic hover zones — image & text cycle on every cursor visit.
 */
(function () {
  'use strict';

  function initDynamicZones() {
    document.querySelectorAll('[data-dynamic]').forEach((zone) => {
      const slides = zone.querySelectorAll('[data-dynamic-item]');
      const counter = zone.querySelector('[data-dynamic-counter]');
      if (slides.length < 2) return;

      let index = 0;

      function showSlide(i) {
        slides.forEach((slide, idx) => {
          slide.classList.toggle('active', idx === i);
          slide.setAttribute('aria-hidden', idx === i ? 'false' : 'true');
        });
        if (counter) {
          counter.textContent = String(i + 1);
        }
      }

      showSlide(0);

      zone.addEventListener('mouseenter', () => {
        index = (index + 1) % slides.length;
        showSlide(index);
        zone.classList.add('is-active');
      });

      zone.addEventListener('mouseleave', () => {
        zone.classList.remove('is-active');
      });

      zone.addEventListener('focusin', () => {
        index = (index + 1) % slides.length;
        showSlide(index);
      });
    });
  }

  function initServiceCardToggle() {
    document.querySelectorAll('[data-service-toggle]').forEach((card) => {
      const alts = card.querySelectorAll('[data-alt-text]');
      if (alts.length < 2) return;

      let index = 0;
      const primary = card.querySelector('.service-card__desc');

      card.addEventListener('mouseenter', () => {
        index = (index + 1) % alts.length;
        const next = alts[index];
        if (primary) {
          primary.textContent = next.textContent;
        }
        card.classList.toggle('is-alt', index % 2 === 1);
      });
    });
  }

  function initMosaicCaptions() {
    const captions = [
      'State-of-the-art treatment rooms',
      'Advanced laser technology',
      'Comfortable consultation suites',
      'Medical-grade skincare lab',
      'Hair restoration center',
      'Welcoming reception area',
    ];

    document.querySelectorAll('[data-mosaic-caption]').forEach((cell, i) => {
      const cap = cell.querySelector('[data-mosaic-text]');
      if (!cap) return;
      const pool = captions;
      let idx = i % pool.length;

      cell.addEventListener('mouseenter', () => {
        idx = (idx + 1) % pool.length;
        cap.textContent = pool[idx];
      });
    });
  }

  function initPhotoStack() {
    document.querySelectorAll('[data-photo-stack]').forEach((stack) => {
      const images = stack.querySelectorAll('img');
      if (images.length < 2) return;
      let index = 0;

      stack.addEventListener('mouseenter', () => {
        images[index].classList.remove('active');
        index = (index + 1) % images.length;
        images[index].classList.add('active');
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initDynamicZones();
      initServiceCardToggle();
      initMosaicCaptions();
      initPhotoStack();
    });
  } else {
    initDynamicZones();
    initServiceCardToggle();
    initMosaicCaptions();
    initPhotoStack();
  }
})();
