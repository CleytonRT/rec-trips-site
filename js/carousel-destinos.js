let slideIndex = 0;
const carousel = document.getElementById('carousel-destinos');
const slides = carousel ? carousel.querySelectorAll('.destino-slide') : [];
const totalSlides = slides.length;

const btnVoltar = document.getElementById('btn-voltar');
const btnAvancar = document.getElementById('btn-avancar');

function atualizarSlide() {
  if (!carousel || !totalSlides) return;
  carousel.style.transform = `translateX(-${slideIndex * 30}%)`;
  atualizarBotoes();
}

function avancarSlide() {
  if (slideIndex < totalSlides - 1) {
    slideIndex++;
    atualizarSlide();
  }
}

function voltarSlide() {
  if (slideIndex > 0) {
    slideIndex--;
    atualizarSlide();
  }
}

function atualizarBotoes() {
  if (btnVoltar && btnAvancar) {
    btnVoltar.style.display = slideIndex === 0 ? 'none' : 'block';
    btnAvancar.style.display = slideIndex === totalSlides - 1 ? 'none' : 'block';
  }
}

atualizarSlide();
