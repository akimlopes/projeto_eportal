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
}, 2500); // Troca a cada 4 segundos
//Validar login
      // Impede envio do formulário

      const RM = document.getElementById('RM').value;
      const senha = document.getElementById('senha').value;

 // Verificação
      if ((RM === 'admin' && senha === '12345678') || (RM === 'user' && senha === '12345678')) {
// Redirecionar
        window.location.href = '/views/home.ejs';
      } else {
        alert('Usuário ou senha incorretos!');
      }
  ;