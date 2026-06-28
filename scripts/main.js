document.addEventListener('DOMContentLoaded', () => {
  initHeaderAnimation();
  initSmoothScrolling();
  initBackToTop();
  initFloatingTime();
  initSkills();
  initSideNav();
  initRevealOnScroll();
  initModals();
  initParallax();
  initKonami();
  initImageFallbacks();
  initCardTilt();
  initButtonRipple();
});

function prefersReducedMotion() {
  return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function initHeaderAnimation() {
  const elements = document.querySelectorAll('.site-header > *');
  if (!elements.length || prefersReducedMotion() || typeof anime === 'undefined') return;

  anime({
    targets: elements,
    opacity: [0, 1],
    translateY: [18, 0],
    duration: 650,
    delay: anime.stagger(90),
    easing: 'easeOutCubic'
  });
}

function initSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (event) => {
      const href = anchor.getAttribute('href');
      if (!href || href === '#') return;

      const target = document.querySelector(href);
      if (!target) return;

      event.preventDefault();
      target.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
    });
  });
}

function initBackToTop() {
  const button = document.getElementById('back-to-top');
  if (!button) return;

  const toggle = () => {
    button.classList.toggle('is-visible', window.scrollY > 300);
  };

  toggle();
  window.addEventListener('scroll', toggle, { passive: true });
  button.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
  });
}

function initFloatingTime() {
  const timeEl = document.getElementById('floating-time');
  if (!timeEl) return;

  const update = () => {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12 || 12;
    timeEl.textContent = `${hours}:${minutes} ${ampm}`;
  };

  update();
  setInterval(update, 60 * 1000);
}

function initSkills() {
  const skillsSection = document.getElementById('skills');
  const cards = document.querySelectorAll('.skill-card');
  if (!skillsSection || !cards.length) return;

  const animate = () => {
    const reduce = prefersReducedMotion();

    cards.forEach((card) => {
      if (card.dataset.animated === 'true') return;
      card.dataset.animated = 'true';

      const target = Number.parseInt(card.dataset.fill || '0', 10);
      const ring = card.querySelector('.skill-ring');
      const percent = card.querySelector('.skill-percent');

      if (ring) {
        requestAnimationFrame(() => ring.style.setProperty('--pct', target));
      }

      if (!percent) return;

      if (reduce) {
        percent.textContent = `${target}%`;
        return;
      }

      const duration = 900;
      const start = performance.now();

      function step(now) {
        const progress = Math.min((now - start) / duration, 1);
        percent.textContent = `${Math.round(target * progress)}%`;

        if (progress < 1) {
          requestAnimationFrame(step);
        }
      }

      requestAnimationFrame(step);
    });
  };

  if (!('IntersectionObserver' in window)) {
    animate();
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animate();
        obs.disconnect();
      }
    });
  }, { threshold: 0.3 });

  observer.observe(skillsSection);
}

function initSideNav() {
  const navLinks = Array.from(document.querySelectorAll('#side-nav a[href^="#"]'));
  const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  if (!navLinks.length || !sections.length) return;

  const update = () => {
    const scrollPos = window.scrollY + window.innerHeight / 2;

    sections.forEach((section) => {
      const link = navLinks.find((item) => item.getAttribute('href') === `#${section.id}`);
      if (!link) return;

      const isActive = section.offsetTop <= scrollPos && section.offsetTop + section.offsetHeight > scrollPos;
      link.classList.toggle('active', isActive);
    });
  };

  update();
  window.addEventListener('scroll', update, { passive: true });
}

function initRevealOnScroll() {
  const elements = document.querySelectorAll('.reveal-up, .reveal-fade');
  if (!elements.length) return;

  if (!('IntersectionObserver' in window) || prefersReducedMotion()) {
    elements.forEach((element) => element.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  elements.forEach((element) => observer.observe(element));
}

function initModals() {
  let lastFocused = null;

  function focusFirst(modal) {
    const focusable = modal.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (focusable) focusable.focus();
  }

  function openModal(selector) {
    const modal = document.querySelector(selector);
    if (!modal) return;

    lastFocused = document.activeElement;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');

    const dialog = modal.querySelector('.modal-dialog');
    if (dialog) requestAnimationFrame(() => dialog.classList.add('open-anim'));
    focusFirst(modal);
  }

  function closeModal(modal) {
    if (!modal) return;

    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');

    const dialog = modal.querySelector('.modal-dialog');
    if (dialog) dialog.classList.remove('open-anim');

    if (lastFocused && typeof lastFocused.focus === 'function') {
      lastFocused.focus();
    }
  }

  document.addEventListener('click', (event) => {
    const openButton = event.target.closest('.open-modal');
    if (openButton) {
      event.preventDefault();
      openModal(openButton.dataset.target);
      return;
    }

    const closeButton = event.target.closest('[data-close]');
    if (closeButton) {
      event.preventDefault();
      closeModal(closeButton.closest('.modal'));
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    document.querySelectorAll('.modal.is-open').forEach(closeModal);
  });
}

function initParallax() {
  const blobs = document.querySelectorAll('.parallax-bg .blob');
  if (!blobs.length || prefersReducedMotion()) return;

  const update = () => {
    const y = window.scrollY || document.documentElement.scrollTop || 0;

    blobs.forEach((blob) => {
      const depth = Number.parseFloat(blob.dataset.depth || '0.1');
      blob.style.transform = `translateY(${y * depth}px)`;
    });
  };

  update();
  window.addEventListener('scroll', update, { passive: true });
}

function initKonami() {
  const sequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
  const overlay = document.getElementById('konami-overlay');
  const keySeqEl = overlay ? overlay.querySelector('.key-sequence') : null;
  const messageEl = overlay ? overlay.querySelector('.konami-msg') : null;
  const labels = {
    ArrowUp: 'Up',
    ArrowDown: 'Down',
    ArrowLeft: 'Left',
    ArrowRight: 'Right',
    b: 'B',
    a: 'A'
  };

  let position = 0;
  let hideTimer = null;

  function showMessage(text) {
    if (!overlay || !messageEl) return;

    overlay.classList.add('visible');
    messageEl.textContent = text;
    clearTimeout(hideTimer);
    hideTimer = setTimeout(() => {
      overlay.classList.remove('visible', 'success');
      if (keySeqEl) keySeqEl.textContent = '';
      messageEl.textContent = '';
    }, 1600);
  }

  function showKey(key, ok) {
    if (!overlay || !keySeqEl) return;

    overlay.classList.add('visible');
    const token = document.createElement('span');
    token.className = ok ? 'key-token' : 'key-token is-error';
    token.textContent = labels[key] || key.toUpperCase();
    keySeqEl.appendChild(token);

    while (keySeqEl.children.length > sequence.length) {
      keySeqEl.removeChild(keySeqEl.firstElementChild);
    }
  }

  function handleKey(key) {
    const normalized = key.length === 1 ? key.toLowerCase() : key;

    if (normalized === sequence[position]) {
      showKey(normalized, true);
      position += 1;

      if (position === sequence.length) {
        position = 0;
        if (overlay) overlay.classList.add('success');
        showMessage('Sequence complete!');
        triggerFireworks();
      }

      return;
    }

    if (position > 0) {
      showKey(normalized, false);
      showMessage("You're close!");
    }

    position = 0;
  }

  document.addEventListener('keydown', (event) => {
    const isTouchDevice = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
    const isSmallScreen = window.innerWidth <= 720;
    if (isTouchDevice || isSmallScreen) return;
    handleKey(event.key);
  });

  document.addEventListener('click', (event) => {
    const hint = event.target.closest('.easter-hint');
    if (!hint) return;
    showMessage(hint.dataset.hint || 'Try the classic key sequence.');
  });

  initKonamiSwipes(handleKey);
}

function initKonamiSwipes(handleKey) {
  if (!window.matchMedia || !window.matchMedia('(pointer: coarse)').matches) return;

  let startX = 0;
  let startY = 0;
  let startTime = 0;

  document.addEventListener('touchstart', (event) => {
    if (!event.touches || event.touches.length > 1) return;
    const touch = event.touches[0];
    startX = touch.clientX;
    startY = touch.clientY;
    startTime = Date.now();
  }, { passive: true });

  document.addEventListener('touchend', (event) => {
    const touch = event.changedTouches && event.changedTouches[0];
    if (!touch || Date.now() - startTime > 700) return;

    const dx = touch.clientX - startX;
    const dy = touch.clientY - startY;
    if (Math.abs(dx) < 30 && Math.abs(dy) < 30) return;

    if (Math.abs(dx) > Math.abs(dy)) {
      handleKey(dx > 0 ? 'ArrowRight' : 'ArrowLeft');
    } else {
      handleKey(dy > 0 ? 'ArrowDown' : 'ArrowUp');
    }
  }, { passive: true });
}

function triggerFireworks() {
  const canvas = document.getElementById('fireworks-canvas');
  if (!canvas || prefersReducedMotion()) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let width = window.innerWidth;
  let height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;
  canvas.classList.add('is-active');

  const fireworks = [];
  const particles = [];
  const rand = (min, max) => Math.random() * (max - min) + min;

  class Firework {
    constructor() {
      this.x = rand(60, width - 60);
      this.y = height + 10;
      this.targetY = rand(80, height * 0.45);
      this.color = `hsl(${Math.floor(rand(0, 360))}, 85%, ${rand(45, 65)}%)`;
      this.speed = rand(5, 9);
      this.vx = rand(-1.2, 1.2);
    }

    update() {
      this.y -= this.speed;
      this.x += this.vx * 0.6;
      this.speed *= 0.99;

      if (this.y <= this.targetY || this.speed < 1.4) {
        for (let i = 0; i < 60; i += 1) {
          particles.push(new Particle(this.x, this.y, this.color));
        }
        return true;
      }

      return false;
    }

    draw() {
      ctx.beginPath();
      ctx.fillStyle = this.color;
      ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  class Particle {
    constructor(x, y, color) {
      const speed = rand(1, 7);
      const angle = rand(0, Math.PI * 2);
      this.x = x;
      this.y = y;
      this.color = color;
      this.alpha = 1;
      this.decay = rand(0.008, 0.03);
      this.radius = rand(1, 3.5);
      this.vx = Math.cos(angle) * speed;
      this.vy = Math.sin(angle) * speed;
    }

    update() {
      this.vy += 0.06;
      this.x += this.vx;
      this.y += this.vy;
      this.alpha -= this.decay;
      return this.alpha <= 0;
    }

    draw() {
      ctx.globalAlpha = Math.max(0, this.alpha);
      ctx.beginPath();
      ctx.fillStyle = this.color;
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    }
  }

  const resize = () => {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
  };

  window.addEventListener('resize', resize);

  let animationFrame = null;
  function animate() {
    animationFrame = requestAnimationFrame(animate);
    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillStyle = 'rgba(0,0,0,0.18)';
    ctx.fillRect(0, 0, width, height);
    ctx.globalCompositeOperation = 'lighter';

    if (Math.random() < 0.12) fireworks.push(new Firework());

    for (let i = fireworks.length - 1; i >= 0; i -= 1) {
      if (fireworks[i].update()) fireworks.splice(i, 1);
      else fireworks[i].draw();
    }

    for (let i = particles.length - 1; i >= 0; i -= 1) {
      if (particles[i].update()) particles.splice(i, 1);
      else particles[i].draw();
    }
  }

  animate();

  setTimeout(() => {
    cancelAnimationFrame(animationFrame);
    window.removeEventListener('resize', resize);
    ctx.clearRect(0, 0, width, height);
    canvas.classList.remove('is-active');
  }, 6500);
}

function initImageFallbacks() {
  const placeholderSVG = encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="600" height="320" viewBox="0 0 600 320"><rect width="100%" height="100%" fill="#2a2b2d"/><text x="50%" y="50%" fill="#9ea3a8" font-family="sans-serif" font-size="20" dominant-baseline="middle" text-anchor="middle">Image not found</text></svg>'
  );
  const dataUri = `data:image/svg+xml;utf8,${placeholderSVG}`;

  document.querySelectorAll('img').forEach((img) => {
    img.addEventListener('error', function onError() {
      this.removeEventListener('error', onError);
      this.src = dataUri;
      this.classList.add('img--placeholder');
    });
  });
}

function initCardTilt() {
  if (!window.matchMedia || !window.matchMedia('(pointer: fine)').matches || prefersReducedMotion()) return;

  document.querySelectorAll('.project-card').forEach((card) => {
    let rect = null;
    let frame = null;

    const reset = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        card.style.transform = '';
      });
    };

    card.addEventListener('mousemove', (event) => {
      if (!rect) rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      const rotateY = (x - 0.5) * -10;
      const rotateX = (y - 0.5) * 10;

      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      });
    });

    card.addEventListener('mouseleave', reset);
    card.addEventListener('blur', reset, true);
    window.addEventListener('resize', () => {
      rect = null;
    });
  });
}

function initButtonRipple() {
  document.addEventListener('click', (event) => {
    const button = event.target.closest('.btn');
    if (!button || prefersReducedMotion()) return;

    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 1.2;
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    ripple.style.width = `${size}px`;
    ripple.style.height = `${size}px`;
    ripple.style.left = `${event.clientX - rect.left - size / 2}px`;
    ripple.style.top = `${event.clientY - rect.top - size / 2}px`;

    button.appendChild(ripple);
    setTimeout(() => ripple.remove(), 750);
  });
}
