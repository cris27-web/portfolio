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
  }, '-=600'); // overlap the animation by 600ms

  // Animate project cards fade & rise on page load
anime({
  targets: '.project-card',
  translateY: [50, 0],
  opacity: [0, 1],
  delay: anime.stagger(200), // each card starts 200ms after previous
  duration: 800,
  easing: 'easeOutExpo'
});
