const items = document.querySelectorAll('.carousel-item');
let current = 0;

function showNext() {
  items[current].classList.remove('active');
  current = (current + 1) % items.length;
  items[current].classList.add('active');
}

setInterval(showNext, 5000); // Troca a cada 5 segundos

// Toggle menu mobile
const mobileMenuButton = document.querySelector('.mobile-menu-button');
const mobileMenu = document.querySelector('.mobile-menu');

if (mobileMenuButton && mobileMenu) {
  mobileMenuButton.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
  });
}

// Scroll suave ao clicar em âncoras da navbar
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId && targetId !== '#') {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          window.scrollTo({
            top: targetElement.offsetTop - 80, // ajuste conforme a altura da sua navbar
            behavior: 'smooth'
          });
  
          // Esconde o menu mobile após o clique (se visível)
          if (window.innerWidth < 768) {
            document.querySelector('.mobile-menu').classList.add('hidden');
          }
        }
      }
    });
  });
  
  function abrirWhatsApp() {
    const linkSeguro = "https://wa.me/message/G7FUENJX5QHII1";
    window.open(linkSeguro, "_blank");
  }
  