/**
 * REVA Skin & Hair Clinic — Google Maps branch switcher.
 * One Google Maps embed per branch; clicking a branch in the list
 * shows that branch's map. Embeds load lazily on first activation.
 */
(function () {
  'use strict';

  const framesContainer = document.querySelector('.locations__frames');
  const list = document.querySelector('.locations__list');
  if (!framesContainer || !list) return;

  const frames = Array.from(document.querySelectorAll('.locations__frame'));
  const buttons = Array.from(document.querySelectorAll('.location-btn'));

  function activateFrame(id, focus) {
    const nextFrame = frames.find((f) => f.dataset.locFrame === id);
    if (!nextFrame) return;

    const iframe = nextFrame.querySelector('iframe');

    if (iframe && !iframe.src) {
      const src = iframe.getAttribute('data-src');
      if (src) iframe.src = src;
    }

    frames.forEach((frame) => {
      const active = frame === nextFrame;
      frame.classList.toggle('is-active', active);
      if (!active) {
        const otherFrame = frame.querySelector('iframe');
        if (otherFrame) otherFrame.setAttribute('aria-hidden', 'true');
      }
    });

    if (nextFrame) {
      const activeFrame = nextFrame.querySelector('iframe');
      if (activeFrame) activeFrame.removeAttribute('aria-hidden');
    }

    buttons.forEach((btn) => {
      const active = btn.dataset.loc === id;
      btn.setAttribute('aria-pressed', String(active));
      btn.classList.toggle('is-active', active);
    });

    if (focus && nextFrame) {
      nextFrame.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      activateFrame(btn.dataset.loc, true);
    });
  });

  const firstBtn = buttons.find((b) => b.classList.contains('is-active')) || buttons[0];
  if (firstBtn) activateFrame(firstBtn.dataset.loc, false);
})();