const inputs = document.querySelectorAll(".input-field");
const toggle_btn = document.querySelectorAll(".toggle");
const main = document.querySelector("main");
const bullets = document.querySelectorAll(".bullets span");
const images = document.querySelectorAll(".image");

inputs.forEach((inp) => {
  inp.addEventListener("focus", () => {
    inp.classList.add("active");
  });
  inp.addEventListener("blur", () => {
    if (inp.value != "") return;
    inp.classList.remove("active");
  });
});

toggle_btn.forEach((btn) => {
  btn.addEventListener("click", () => {
    main.classList.toggle("sign-up-mode");
  });
});

function moveSlider(index) {
  let currentImage = document.querySelector(`.img-${index}`);
  images.forEach((img) => img.classList.remove("show"));
  currentImage.classList.add("show");

  const textSlider = document.querySelector(".text-group");
  textSlider.style.transform = `translateY(${-(index - 1) * 2.2}rem)`;

  bullets.forEach((bull) => bull.classList.remove("active"));
  bullets[index - 1].classList.add("active");
}

bullets.forEach((bullet, index) => {
  bullet.addEventListener("click", function () {
    moveSlider(index + 1);
  });
});

// Automatizar o slider
let currentIndex = 1;
const maxIndex = bullets.length;

setInterval(() => {
  currentIndex++;
  if (currentIndex > maxIndex) currentIndex = 1;
  moveSlider(currentIndex);
}, 2500); // Troca a cada 2,5 segundos

document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('loginForm');
  const termsModal = document.getElementById('terms-modal');
  const acceptBtn = document.getElementById('accept-terms');
  const declineBtn = document.getElementById('decline-terms');
  const checkbox = document.getElementById('terms-checkbox');
  const warning = document.getElementById('terms-warning');

  if (!form || !termsModal) return;

  // Ao enviar o form, abrir o modal em vez de submeter imediatamente
  form.addEventListener('submit', function (evt) {
    evt.preventDefault();
    warning.textContent = '';
    checkbox.checked = false;
    termsModal.classList.add('open');
    termsModal.setAttribute('aria-hidden', 'false');
    // manter foco acessível
    checkbox.focus();
  });

  // Aceitar: só submete se checkbox marcado
  acceptBtn.addEventListener('click', function () {
    if (checkbox.checked) {
      termsModal.classList.remove('open');
      termsModal.setAttribute('aria-hidden', 'true');
      // submete o form normalmente
      form.submit();
    } else {
      warning.textContent = 'É obrigatório aceitar os Termos de Uso para prosseguir.';
      checkbox.focus();
    }
  });

  // Recusar: fecha modal e mostra aviso simples
  declineBtn.addEventListener('click', function () {
    termsModal.classList.remove('open');
    termsModal.setAttribute('aria-hidden', 'true');
    alert('Você precisa aceitar os Termos de Uso para entrar no sistema.');
  });

  // fechar clicando fora do conteúdo ou pressionando ESC
  termsModal.addEventListener('click', function (e) {
    if (e.target === termsModal) {
      termsModal.classList.remove('open');
      termsModal.setAttribute('aria-hidden', 'true');
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      termsModal.classList.remove('open');
      termsModal.setAttribute('aria-hidden', 'true');
    }
  });
});
