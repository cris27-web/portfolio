// Typing effect for tagline
const tagline = document.getElementById('tagline');
const text = 'Web Developer & Designer';
let index = 0;

function type() {
  if (index < text.length) {
    tagline.textContent += text.charAt(index);
    index++;
    setTimeout(type, 150);
  }
}

tagline.textContent = ''; // Clear initial text
type();

// Animate header on page load
anime.timeline()
  .add({
    targets: 'h1',
    translateY: [-50, 0],
    opacity: [0, 1],
    duration: 1000,
    easing: 'easeOutExpo'
  })
  .add({
    targets: '#tagline',
    opacity: [0, 1],
    duration: 800,
    easing: 'easeOutExpo'
  }, '-=600'); // overlap by 600ms

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if(target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// Back to top button show/hide & smooth scroll
const backToTop = document.getElementById('back-to-top');

window.addEventListener('scroll', () => {
  if (window.scrollY > 300) {
    backToTop.style.display = 'block';
  } else {
    backToTop.style.display = 'none';
  }
});

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

function animateChange(el) {
  anime.timeline()
    .add({
      targets: el,
      opacity: [1, 0],
      duration: 0,
      easing: 'easeOutQuad',
    })
    .add({
      targets: el,
      opacity: [0, 1],
      duration: 0,
      easing: 'easeInQuad',
    });
}


// Format functions (unchanged)
function formatTime(date) {
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  const ampm = hours >= 12 ? 'PM' : 'AM';

  hours = hours % 12;
  hours = hours ? hours : 12;

  const strTime = [
    hours.toString().padStart(2, '0'),
    minutes.toString().padStart(2, '0'),
    seconds.toString().padStart(2, '0'),
  ].join(':');

  return `${strTime} ${ampm}`;
}

function formatDate(date) {
  return date.toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

// Store previous values to detect change
let prevTime = '';
let prevDate = '';

function updateFloatingTime() {
  const timeEl = document.getElementById('floating-time');
  if (!timeEl) return;

  const now = new Date();
  let hours = now.getHours();
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';

  hours = hours % 12 || 12; // convert 0 to 12 for 12-hour format
  const timeString = `${hours}:${minutes} ${ampm}`;

  timeEl.textContent = timeString;
}

// Initial call and update every minute
updateFloatingTime();
setInterval(updateFloatingTime, 60 * 1000);
// Skills animation (updated: width + count-up + aria)
function animateSkills() {
  const skills = document.querySelectorAll('.skill-fill');

  // Don't animate if user prefers reduced motion
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  skills.forEach(skill => {
    const raw = (skill.getAttribute('data-fill') || '0%').trim();
    const target = parseInt(raw.replace('%',''), 10) || 0;

    // set width (CSS handles transition)
    if (!reduce) {
      // trigger reflow to ensure transition when element becomes visible
      // (use requestAnimationFrame to separate style writes)
      requestAnimationFrame(() => {
        skill.style.width = target + '%';
      });
    } else {
      skill.style.width = target + '%';
    }

    // animate numeric counter
    const percentEl = skill.querySelector('.percent');
    if (!percentEl) return;

    // If already animated, skip
    if (skill.dataset.animated === 'true') {
      // ensure aria reflects final value
      skill.setAttribute('aria-valuenow', String(target));
      percentEl.textContent = target + '%';
      return;
    }

    skill.dataset.animated = 'true';
    const duration = reduce ? 0 : 900; // ms
    const start = performance.now();
    const startValue = 0;

    function step(now) {
      const elapsed = now - start;
      const progress = duration ? Math.min(elapsed / duration, 1) : 1;
      const value = Math.round(startValue + (target - startValue) * progress);
      percentEl.textContent = value + '%';
      skill.setAttribute('aria-valuenow', String(value));

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        // ensure exact final
        percentEl.textContent = target + '%';
        skill.setAttribute('aria-valuenow', String(target));
      }
    }

    requestAnimationFrame(step);
  });
}

// ---------- helper: is element in viewport ----------
function isInViewport(el, offset = 0) {
  if (!el) return false;
  const rect = el.getBoundingClientRect();
  return rect.top <= (window.innerHeight || document.documentElement.clientHeight) - offset
      && rect.bottom >= 0 + offset;
}

// Trigger skills animation when skills section becomes visible (reuse existing logic)
function checkSkillsAnimation() {
  const skillsSection = document.getElementById('skills');
  if (!skillsSection) return;
  if (!skillsSection.classList.contains('animated') && isInViewport(skillsSection, 40)) {
    animateSkills();
    skillsSection.classList.add('animated');
  }
}

// ensure the check runs early and also when images/fonts finish layout
window.addEventListener('scroll', checkSkillsAnimation);
window.addEventListener('load', checkSkillsAnimation);
document.addEventListener('DOMContentLoaded', checkSkillsAnimation);

const navLinks = document.querySelectorAll('#side-nav ul li a');
const sections = Array.from(navLinks).map(link => document.querySelector(link.getAttribute('href')));

function onScroll() {
  const scrollPos = window.scrollY + window.innerHeight / 2; // middle of viewport

  sections.forEach((section, index) => {
    if (section.offsetTop <= scrollPos && (section.offsetTop + section.offsetHeight) > scrollPos) {
      navLinks.forEach(link => link.classList.remove('active'));
      navLinks[index].classList.add('active');
    }
  });
}

window.addEventListener('scroll', onScroll);

// Optional: Smooth scroll behavior for nav links
navLinks.forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});
document.addEventListener('DOMContentLoaded', () => {
  // Select the h1 inside header
  const heading = document.querySelector('header h1');

  // Split text into chars and clear original text
  const chars = heading.textContent.split('');
  heading.textContent = '';

  // Wrap each char in a span
  chars.forEach(char => {
    const span = document.createElement('span');
    span.textContent = char;
    heading.appendChild(span);
  });

  // Select all spans to animate
  const charSpans = heading.querySelectorAll('span');

  // Anime.js animation
  anime({
    targets: charSpans,
    y: [
      { value: '-2.75rem', easing: 'easeOutExpo', duration: 600 },
      { value: 0, easing: 'easeOutBounce', duration: 800, delay: 100 }
    ],
    rotate: {
      value: '-1turn',
      delay: 0
    },
    delay: anime.stagger(50),
    easing: 'easeInOutCirc',
    loopDelay: 1000,
    loop: true
  });
});

/* ---------- Reveal on scroll (IntersectionObserver) ---------- */
(function initRevealOnScroll() {
  const els = document.querySelectorAll('.reveal-up, .reveal-fade');
  if (!('IntersectionObserver' in window) || els.length === 0) {
    // Fallback: show immediately
    els.forEach(el => el.classList.add('visible'));
    return;
  }

  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  els.forEach(el => io.observe(el));
})();

/* ---------- Case study modals ---------- */
(function initModals() {
  function openModal(sel) {
    const modal = document.querySelector(sel);
    if (!modal) return;
    modal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }
  function closeModal(modal) {
    modal.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  document.addEventListener('click', (e) => {
    const openBtn = e.target.closest('.open-modal');
    if (openBtn) {
      const target = openBtn.getAttribute('data-target');
      if (target) openModal(target);
    }
    if (e.target.matches('[data-close]') || e.target.closest('[data-close]')) {
      const modal = e.target.closest('.modal');
      if (modal) closeModal(modal);
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal.is-open').forEach(m => {
        m.classList.remove('is-open');
        document.body.style.overflow = '';
      });
    }
  });
})();

/* ---------- Light parallax background ---------- */
(function initParallax() {
  const blobs = document.querySelectorAll('.parallax-bg .blob');
  if (!blobs.length) return;

  const onScroll = () => {
    const y = window.scrollY || document.documentElement.scrollTop || 0;
    blobs.forEach(blob => {
      const depth = parseFloat(blob.dataset.depth || '0.1');
      // subtle move (slower than scroll): positive translates down, feels “deeper”
      blob.style.transform = `translateY(${y * depth}px)`;
    });
  };

  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
})();


/* ---------- Konami Code (visual + sequence handling + improved fireworks) ---------- */
// Sequence: up up down down left right left right b a
const konamiSeq = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
let konamiPos = 0;
let konamiActive = false; // true after first correct key

// optional overlay elements — guard in case markup is missing
const overlay = document.getElementById('konami-overlay');
const keySeqEl = overlay ? overlay.querySelector('.key-sequence') : null;
const konamiMsg = overlay ? overlay.querySelector('.konami-msg') : null;

// nice printable labels for keys
const keyLabel = {
  'ArrowUp': '↑',
  'ArrowDown': '↓',
  'ArrowLeft': '←',
  'ArrowRight': '→',
  'b': 'B',
  'a': 'A'
};

// show a token for a pressed key (no-op if overlay/keySeqEl missing)
function showKeyToken(keyName, ok = true) {
  if (!overlay || !keySeqEl) return;
  overlay.classList.add('visible');
  const token = document.createElement('span');
  token.className = 'key-token';
  if (!ok) token.style.opacity = '0.6';
  token.textContent = keyLabel[keyName] || keyName.toUpperCase();
  keySeqEl.appendChild(token);

  // pulse animation
  requestAnimationFrame(() => token.classList.add('pulse'));
  setTimeout(() => token.classList.remove('pulse'), 260);

  // keep only last N tokens (N = sequence length)
  const max = konamiSeq.length;
  while (keySeqEl.children.length > max) keySeqEl.removeChild(keySeqEl.firstChild);
}

// clear tokens and message (safe when overlay missing)
function clearKonamiVisuals(delay = 0) {
  if (!overlay || !keySeqEl || !konamiMsg) return;
  setTimeout(() => {
    keySeqEl.innerHTML = '';
    overlay.classList.remove('show-msg','success','visible');
    konamiMsg.textContent = '';
  }, delay);
}

// show message in overlay (safe when konamiMsg missing)
function showKonamiMessage(text, short = true) {
  if (!konamiMsg || !overlay) return;
  konamiMsg.textContent = text;
  overlay.classList.add('show-msg');
  if (short) setTimeout(() => overlay.classList.remove('show-msg'), 1100);
}

/* ---------- improved fireworks function unchanged (uses DOM canvas if present) ---------- */
function triggerFireworks() {
  const canvas = document.getElementById('fireworks-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W = window.innerWidth;
  let H = window.innerHeight;
  canvas.width = W;
  canvas.height = H;
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '9999';

  const fireworks = [];
  const particles = [];

  function rand(min, max) { return Math.random() * (max - min) + min; }

  class Firework {
    constructor(x, y, targetY, color) {
      this.x = x; this.y = y; this.targetY = targetY; this.color = color;
      this.speed = rand(5, 9);
      this.radius = rand(2,4);
      this.vx = rand(-1.2,1.2);
    }
    update() {
      this.y -= this.speed;
      this.x += this.vx * 0.6;
      this.speed *= 0.99;
      if (this.y <= this.targetY || this.speed < 1.4) {
        this.explode();
        return true;
      }
      return false;
    }
    draw() {
      ctx.beginPath();
      ctx.fillStyle = this.color;
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
      ctx.fill();
    }
    explode() {
      const count = Math.floor(rand(40, 80));
      for (let i=0;i<count;i++) particles.push(new Particle(this.x, this.y, this.color));
    }
  }

  class Particle {
    constructor(x, y, color) {
      this.x = x; this.y = y; this.color = color;
      this.speed = rand(1,7);
      this.angle = rand(0, Math.PI*2);
      this.alpha = 1;
      this.decay = rand(0.008, 0.03);
      this.radius = rand(1,3.5);
      this.vx = Math.cos(this.angle) * this.speed;
      this.vy = Math.sin(this.angle) * this.speed;
      this.gravity = 0.06;
    }
    update() {
      this.vy += this.gravity;
      this.x += this.vx;
      this.y += this.vy;
      this.alpha -= this.decay;
      return this.alpha <= 0;
    }
    draw() {
      ctx.globalAlpha = Math.max(0, this.alpha);
      ctx.beginPath();
      ctx.fillStyle = this.color;
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
      ctx.fill();
      ctx.globalAlpha = 1;
    }
  }

  // animation loop with trails: fade previous frame with low alpha rectangle
  let animId;
  function animate() {
    animId = requestAnimationFrame(animate);

    // fade out previous frame slightly (gives trails)
    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillStyle = 'rgba(0,0,0,0.18)';
    ctx.fillRect(0, 0, W, H);
    ctx.globalCompositeOperation = 'lighter'; // additive for bright explosions

    // launch occasional fireworks
    if (Math.random() < 0.12) {
      const x = rand(60, W - 60);
      const targetY = rand(80, H * 0.45);
      const color = `hsl(${Math.floor(rand(0,360))}, 85%, ${rand(45,65)}%)`;
      fireworks.push(new Firework(x, H + 10, targetY, color));
    }

    // update/draw fireworks
    for (let i = fireworks.length - 1; i >= 0; i--) {
      const fw = fireworks[i];
      if (fw.update()) fireworks.splice(i,1);
      else fw.draw();
    }

    // update/draw particles
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      if (p.update()) particles.splice(i,1);
      else p.draw();
    }
  }

  // visual pulse on blobs during fireworks
  document.body.classList.add('fireworks-active');
  animate();

  // stop after a duration
  setTimeout(() => {
    cancelAnimationFrame(animId);
    // quickly fade out particles
    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.fillRect(0,0,W,H);
    ctx.clearRect(0,0,W,H);
    document.body.classList.remove('fireworks-active');
  }, 6500);
}

/* ---------- helper to process Konami input (keyboard only) ---------- */
function handleKonamiKey(key) {
  // normalize single-character keys to lowercase (a/b) while keeping arrows
  const k = (key.length === 1) ? key.toLowerCase() : key;

  if (k === konamiSeq[konamiPos]) {
    if (!konamiActive) konamiActive = true;
    showKeyToken(k, true);
    konamiPos++;
    if (konamiPos === konamiSeq.length) {
      if (overlay) overlay.classList.add('success');
      showKonamiMessage("Sequence complete! 🎆", true);
      triggerFireworks();
      setTimeout(() => clearKonamiVisuals(400), 1200);
      konamiPos = 0;
      konamiActive = false;
    }
  } else {
    if (konamiActive) {
      showKeyToken(k, false);
      showKonamiMessage("You're close!", true);
      konamiPos = 0;
      konamiActive = false;
      setTimeout(() => clearKonamiVisuals(600), 900);
    } else {
      // ignore stray input before sequence starts
    }
  }
}

/* ---------- Desktop-only keyboard listener ----------
   Ignore keyboard Konami input on touch / small screens.
*/
document.addEventListener('keydown', (e) => {
  const isTouchDevice = ('ontouchstart' in window) ||
                        (window.matchMedia && window.matchMedia('(pointer: coarse)').matches) ||
                        /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  const isSmallScreen = window.innerWidth <= 720;
  if (isTouchDevice || isSmallScreen) return;
  handleKonamiKey(e.key);
});

// Keep hint click behavior simple (no mobile UI/timers)
document.addEventListener('click', (ev) => {
  const hint = ev.target.closest('.easter-hint');
  if (!hint) return;
  const text = hint.dataset.hint || 'Try arrow keys';
  showKonamiMessage(text, true);
});

/* ---------- Minor safety: guard mobile nav toggle hookup ---------- */
document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.querySelector(".hamburger");
  const navLinks = document.querySelector(".nav-links");
  if (hamburger && navLinks) {
    hamburger.addEventListener("click", () => {
      navLinks.classList.toggle("open");
    });
  }
});

/* ---------- Image fallback: replace broken images with an inline SVG placeholder ---------- */
(function initImageFallbacks() {
  const placeholderSVG = encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="320" viewBox="0 0 600 320">
      <rect width="100%" height="100%" fill="#2a2b2d"/>
      <text x="50%" y="50%" fill="#9ea3a8" font-family="sans-serif" font-size="20" dominant-baseline="middle" text-anchor="middle">Image not found</text>
    </svg>`
  );
  const dataUri = `data:image/svg+xml;utf8,${placeholderSVG}`;

  // Attach a one-time error handler to all <img> so missing files show the placeholder
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('img').forEach(img => {
      img.addEventListener('error', function onErr() {
        this.removeEventListener('error', onErr);
        this.src = dataUri;
        this.classList.add('img--placeholder');
      });
    });
  });
})();

// Mobile nav toggle
document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.querySelector(".hamburger");
  const navLinks = document.querySelector(".nav-links");

  hamburger.addEventListener("click", () => {
    navLinks.classList.toggle("open");
  });
});

const aboutSection = document.getElementById('about');
window.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    aboutSection.classList.add('fade-in');
  }, 300);
});
window.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    aboutSection.classList.add('fade-in');
  }, 300);
});
function openKonamiMobile() {
  if (!konamiMobile) return;
  konamiMobile.classList.add('open');
  konamiMobile.setAttribute('aria-hidden', 'false');
  konamiToggle.setAttribute('aria-expanded', 'true');
  konamiToggle.classList.add('active');
  // show overlay too so tokens/messages are visible
  overlay.classList.add('visible');
  // auto-hide after 12s of inactivity
  clearTimeout(konamiAutoHideTimer);
  konamiAutoHideTimer = setTimeout(closeKonamiMobile, 12000);
}
function closeKonamiMobile() {
  if (!konamiMobile) return;
  konamiMobile.classList.remove('open');
  konamiMobile.setAttribute('aria-hidden', 'true');
  konamiToggle.setAttribute('aria-expanded', 'false');
  konamiToggle.classList.remove('active');
  // optionally hide overlay tokens after short delay if none shown
  clearTimeout(konamiAutoHideTimer);
  konamiAutoHideTimer = setTimeout(() => {
    if (keySeqEl.children.length === 0) overlay.classList.remove('visible');
  }, 600);
}
if (konamiToggle) {
  konamiToggle.addEventListener('click', () => {
    if (konamiMobile && konamiMobile.classList.contains('open')) closeKonamiMobile();
    else openKonamiMobile();
  });
}

// reset auto-hide timer when user interacts with mobile buttons
if (konamiMobile) {
  konamiMobile.addEventListener('click', () => {
    clearTimeout(konamiAutoHideTimer);
    konamiAutoHideTimer = setTimeout(closeKonamiMobile, 12000);
  });
  konamiMobile.addEventListener('touchstart', () => {
    clearTimeout(konamiAutoHideTimer);
    konamiAutoHideTimer = setTimeout(closeKonamiMobile, 12000);
  }, {passive:true});
}

// Hint badges: show short konami hint via overlay message when clicked
document.addEventListener('click', (ev) => {
  const hint = ev.target.closest('.easter-hint');
  if (!hint) return;
  const text = hint.dataset.hint || 'Try arrow keys or the hidden controller';
  showKonamiMessage(text, true);
  // briefly reveal overlay if hidden
  overlay.classList.add('visible');
  clearTimeout(konamiAutoHideTimer);
  konamiAutoHideTimer = setTimeout(() => {
    // keep overlay visible a short time for message, then hide if no tokens
    if (keySeqEl.children.length === 0) overlay.classList.remove('visible');
  }, 1800);
});

/* ---------- Mobile gestures + hotspots for Konami (swipe + quick taps) ---------- */
// Create two small hotspots for B (left) and A (right) so mobile users can tap without opening controller
(function initKonamiHotspots() {
  if (!('ontouchstart' in window)) return; // only for touch devices

  function makeHotspot(side, keyLabelChar, keyName) {
    const el = document.createElement('button');
    el.className = `konami-hotspot ${side}`;
    el.setAttribute('aria-label', `Konami ${keyLabelChar}`);
    el.innerHTML = `<span>${keyLabelChar}</span>`;
    el.dataset.konamiKey = keyName;
    // visual press handler
    const flash = () => {
      el.classList.add('active');
      setTimeout(() => el.classList.remove('active'), 180);
    };
    el.addEventListener('click', (e) => { e.preventDefault(); flash(); handleKonamiKey(keyName); });
    el.addEventListener('touchstart', (e) => { e.preventDefault(); flash(); handleKonamiKey(keyName); }, {passive:false});
    document.body.appendChild(el);
    return el;
  }

  // left -> B, right -> A
  makeHotspot('left', 'B', 'b');
  makeHotspot('right', 'A', 'a');

  // optional: hide hotspots when konamiMobile is explicitly opened (so UI doesn't duplicate)
  const mobilePanel = document.getElementById('konami-mobile');
  const updateHotspotVisibility = () => {
    const hotspots = document.querySelectorAll('.konami-hotspot');
    if (mobilePanel && mobilePanel.classList.contains('open')) {
      hotspots.forEach(h => h.style.display = 'none');
    } else {
      hotspots.forEach(h => h.style.display = (window.innerWidth <= 720 ? 'flex' : 'none'));
    }
  };
  window.addEventListener('resize', updateHotspotVisibility);
  document.addEventListener('DOMContentLoaded', updateHotspotVisibility);
  // also toggle when panel changes
  if (mobilePanel) {
    const obs = new MutationObserver(updateHotspotVisibility);
    obs.observe(mobilePanel, { attributes: true, attributeFilter: ['class'] });
  }
})();

// Swipe detection anywhere on the page mapped to arrow keys
(function initKonamiSwipes() {
  if (!('ontouchstart' in window)) return; // only for touch devices

  let startX = 0, startY = 0, startTime = 0;
  const threshold = 30; // min px move to be considered swipe
  const timeLimit = 700; // ms max for swipe

  function onTouchStart(e) {
    if (!e.touches || e.touches.length > 1) return;
    const t = e.touches[0];
    startX = t.clientX;
    startY = t.clientY;
    startTime = Date.now();
  }

  function onTouchEnd(e) {
    // If touchend has changedTouches, use last known clientX/Y
    const touch = (e.changedTouches && e.changedTouches[0]) || null;
    if (!touch) return;
    const dx = touch.clientX - startX;
    const dy = touch.clientY - startY;
    const dt = Date.now() - startTime;
    if (dt > timeLimit) return; // too slow for a swipe
    if (Math.abs(dx) < threshold && Math.abs(dy) < threshold) return; // not enough movement

    // Determine primary direction
    if (Math.abs(dx) > Math.abs(dy)) {
      if (dx > 0) handleKonamiKey('ArrowRight');
      else handleKonamiKey('ArrowLeft');
    } else {
      if (dy > 0) handleKonamiKey('ArrowDown');
      else handleKonamiKey('ArrowUp');
    }

    // show a visual token quickly (already done inside handleKonamiKey via showKeyToken)
  }

  document.addEventListener('touchstart', onTouchStart, {passive:true});
  document.addEventListener('touchend', onTouchEnd, {passive:true});
})();
  function onTouchEnd(e) {
    // If touchend has changedTouches, use last known clientX/Y
    const touch = (e.changedTouches && e.changedTouches[0]) || null;
    if (!touch) return;
    const dx = touch.clientX - startX;
    const dy = touch.clientY - startY;
    const dt = Date.now() - startTime;
    if (dt > timeLimit) return; // too slow for a swipe
    if (Math.abs(dx) < threshold && Math.abs(dy) < threshold) return; // not enough movement

    // Determine primary direction
    if (Math.abs(dx) > Math.abs(dy)) {
      if (dx > 0) handleKonamiKey('ArrowRight');
      else handleKonamiKey('ArrowLeft');
    } else {
      if (dy > 0) handleKonamiKey('ArrowDown');
      else handleKonamiKey('ArrowUp');
    }

    // show a visual token quickly (already done inside handleKonamiKey via showKeyToken)
  }

  document.addEventListener('touchstart', onTouchStart, {passive:true});
  document.addEventListener('touchend', onTouchEnd, {passive:true});


