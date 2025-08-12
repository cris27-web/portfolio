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

// Animate project cards fade & rise on page load
anime({
  targets: '.project-card',
  translateY: [50, 0],
  opacity: [0, 1],
  delay: anime.stagger(200), // each card starts 200ms after previous
  duration: 800,
  easing: 'easeOutExpo'
});

// Initialize VanillaTilt on project cards
VanillaTilt.init(document.querySelectorAll(".project-card"), {
  max: 15,
  speed: 400,
  glare: true,
  "max-glare": 0.2,
});

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
