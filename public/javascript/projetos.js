function toggleCard(button) {
  const card = button.closest(".card");
  const allCards = document.querySelectorAll(".card");
  const resumolabel = card.querySelector(".resumo-label");

  // Fecha todos os outros cards e mostra o botão de ingressar neles
  allCards.forEach(c => {
    if (c !== card) {
      c.classList.remove("expanded");
      const btn = c.querySelector(".btn-ingressar");
      if (btn) btn.style.display = "flex";
    }
  });

  // Alterna o card clicado
  card.classList.toggle("expanded");
  // Atualiza o texto do botão (ver mais/ver menos)
  const isOpen = card.classList.contains("expanded");
  button.textContent = isOpen ? "Ver menos" : "Ver mais";
  // Esconde ou mostra o botão de ingressar no card atual
  const btnAtual = card.querySelector(".btn-ingressar");
  if (btnAtual) {
    resumolabel.style.display = card.classList.contains("expanded") ? "none" : "block";
    btnAtual.style.display = card.classList.contains("expanded") ? "none" : "flex";
  }
}

document.addEventListener('DOMContentLoaded', function() {
  const modal = document.getElementById('modal-ingressar');
  const btnConfirmar = document.getElementById('btn-confirmar-ingresso');
  const btnCancelar = document.getElementById('btn-cancelar-ingresso');
  let projetoSelecionado = null;

  // Ao clicar no botão de ingressar
  document.querySelectorAll('.btn-ingressar').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      projetoSelecionado = this.closest('.card'); // ou salve algum id/data do projeto
      modal.classList.add('active');
    });
  });

  // Cancelar modal
  btnCancelar.addEventListener('click', function() {
    modal.classList.remove('active');
    projetoSelecionado = null;
  });

  // Confirmar ingresso
  btnConfirmar.addEventListener('click', function() {
    modal.classList.remove('active');
    // Aqui você pode enviar uma requisição para o backend para ingressar no projeto
    // Exemplo: alert('Ingresso confirmado!');
    // projetoSelecionado pode ser usado para identificar o projeto
    alert('Ingresso confirmado!');
    projetoSelecionado = null;
  });
});