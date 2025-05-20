let slideIndex = 0;
const carousel = document.getElementById('carousel-destinos');
const slides = carousel.querySelectorAll('.destino-slide');
const totalSlides = slides.length;

const btnVoltar = document.getElementById('btn-voltar');
const btnAvancar = document.getElementById('btn-avancar');

// Atualiza a posição do carrossel
function atualizarSlide() {
  carousel.style.transform = `translateX(-${slideIndex * 30}%)`;
  atualizarBotoes();
}

// Avança o slide (botão direito)
function avancarSlide() {
  if (slideIndex < totalSlides - 1) {
    slideIndex++;
    atualizarSlide();
  }
}

// Volta o slide (botão esquerdo)
function voltarSlide() {
  if (slideIndex > 0) {
    slideIndex--;
    atualizarSlide();
  }
}

// Mostra ou esconde os botões de navegação
function atualizarBotoes() {
  if (btnVoltar && btnAvancar) {
    btnVoltar.style.display = slideIndex === 0 ? 'none' : 'block';
    btnAvancar.style.display = slideIndex === totalSlides - 1 ? 'none' : 'block';
  }
}

// Inicializa
atualizarSlide();
