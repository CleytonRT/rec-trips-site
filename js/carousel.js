const items = document.querySelectorAll('.carousel-item');
let current = 0;

function showNext() {
  if (!items.length) return;
  items[current].classList.remove('active');
  current = (current + 1) % items.length;
  items[current].classList.add('active');
}

if (items.length > 1) {
  setInterval(showNext, 5000);
}

// Toggle menu mobile
const mobileMenuButton = document.querySelector('.mobile-menu-button');
const mobileMenu = document.querySelector('.mobile-menu');

if (mobileMenuButton && mobileMenu) {
  mobileMenuButton.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
  });
}

// Scroll suave ao clicar em ancoras da navbar
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    if (targetId && targetId !== '#') {
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: 'smooth'
        });

        if (window.innerWidth < 768 && mobileMenu) {
          mobileMenu.classList.add('hidden');
        }
      }
    }
  });
});

function abrirWhatsApp() {
  const linkSeguro = "https://wa.me/message/G7FUENJX5QHII1";
  window.open(linkSeguro, "_blank");
}
