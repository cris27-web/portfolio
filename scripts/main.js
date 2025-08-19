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

// Dark / Light mode toggle with localStorage
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

// Load saved theme from localStorage
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light') {
  body.classList.add('light-mode');
  themeToggle.textContent = '☀️';
} else {
  themeToggle.textContent = '🌙';
}

themeToggle.addEventListener('click', () => {
  body.classList.toggle('light-mode');

  if (body.classList.contains('light-mode')) {
    themeToggle.textContent = '☀️';
    localStorage.setItem('theme', 'light');
  } else {
    themeToggle.textContent = '🌙';
    localStorage.setItem('theme', 'dark');
  }
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
// Skills animation
function animateSkills() {
  const skills = document.querySelectorAll('.skill-fill');
  skills.forEach(skill => {
    const fillWidth = skill.getAttribute('data-fill');
    skill.style.width = fillWidth;
  });
}

function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.bottom >= 0
  );
}

function checkSkillsAnimation() {
  const skillsSection = document.getElementById('skills');
  if (!skillsSection.classList.contains('animated') && isInViewport(skillsSection)) {
    animateSkills();
    skillsSection.classList.add('animated');
  }
}

window.addEventListener('scroll', checkSkillsAnimation);
window.addEventListener('load', checkSkillsAnimation);

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


/* ---------- Konami Code Easter Egg → Fireworks ---------- */
// Sequence: up up down down left right left right b a
const konamiSeq = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
let konamiPos = 0;

document.addEventListener('keydown', (e) => {
  if (e.key === konamiSeq[konamiPos]) {
    konamiPos++;
    if (konamiPos === konamiSeq.length) {
      konamiPos = 0;
      triggerFireworks();
    }
  } else {
    konamiPos = 0; // reset if wrong key
  }
});

function triggerFireworks() {
  const canvas = document.getElementById('fireworks-canvas');
  const ctx = canvas.getContext('2d');
  let W = window.innerWidth;
  let H = window.innerHeight;
  canvas.width = W;
  canvas.height = H;

  // Make canvas overlay transparent & clickable-through if needed
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '9999';

  const fireworks = [];
  const particles = [];

  function random(min, max) {
    return Math.random() * (max - min) + min;
  }

  class Firework {
    constructor(x, y, targetY, color) {
      this.x = x;
      this.y = y;
      this.targetY = targetY;
      this.color = color;
      this.speed = 3;
      this.radius = 2;
    }
    update() {
      this.y -= this.speed;
      if (this.y <= this.targetY) {
        this.explode();
        return true; // remove
      }
      return false;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
    }
    explode() {
      const count = 32;
      for (let i = 0; i < count; i++) {
        particles.push(new Particle(this.x, this.y, this.color));
      }
    }
  }

  class Particle {
    constructor(x, y, color) {
      this.x = x;
      this.y = y;
      this.color = color;
      this.speed = random(1, 5);
      this.angle = random(0, Math.PI * 2);
      this.alpha = 1;
      this.decay = random(0.015, 0.03);
      this.radius = 2;
    }
    update() {
      this.x += Math.cos(this.angle) * this.speed;
      this.y += Math.sin(this.angle) * this.speed + 0.3; // gravity
      this.alpha -= this.decay;
      return this.alpha <= 0;
    }
    draw() {
      ctx.globalAlpha = this.alpha;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
      ctx.globalAlpha = 1;
    }
  }

  let animationId;
  function animate() {
    animationId = requestAnimationFrame(animate);
    ctx.clearRect(0, 0, W, H); // Transparent clear

    if (Math.random() < 0.05) {
      const x = random(100, W - 100);
      const y = H;
      const targetY = random(150, H / 2);
      const color = `hsl(${Math.floor(random(0, 360))}, 100%, 60%)`;
      fireworks.push(new Firework(x, y, targetY, color));
    }

    for (let i = fireworks.length - 1; i >= 0; i--) {
      if (fireworks[i].update()) {
        fireworks.splice(i, 1);
      } else {
        fireworks[i].draw();
      }
    }

    for (let i = particles.length - 1; i >= 0; i--) {
      if (particles[i].update()) {
        particles.splice(i, 1);
      } else {
        particles[i].draw();
      }
    }
  }

  // Add class for blob animations
  document.body.classList.add('fireworks-active');

  animate();

  // Stop fireworks after 6 seconds
  setTimeout(() => {
    cancelAnimationFrame(animationId);
    ctx.clearRect(0, 0, W, H);
    document.body.classList.remove('fireworks-active');
  }, 6000);
}

// Mobile nav toggle
document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.querySelector(".hamburger");
  const navLinks = document.querySelector(".nav-links");

  hamburger.addEventListener("click", () => {
    navLinks.classList.toggle("open");
  });
});

// ...existing code...
const aboutSection = document.getElementById('about');
window.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    aboutSection.classList.add('fade-in');
  }, 300);
});


