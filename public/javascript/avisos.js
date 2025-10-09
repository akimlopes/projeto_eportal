document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('modal-editar-aviso');
  if (!modal) return;

  const formEdit   = document.getElementById('form-editar-aviso');
  const formDelete = document.getElementById('form-excluir-aviso');
  const inputIdEdit = document.getElementById('edit-id');
  const inputIdDel  = document.getElementById('delete-id');
  const inputTitulo = document.getElementById('edit-titulo');
  const inputConteudo = document.getElementById('edit-conteudo');
  const btnCancelar = document.getElementById('btn-cancelar-edicao');

  let currentCard = null;

  function openModal(card) {
    currentCard = card;
    const id = card?.dataset?.avisoId || card?.getAttribute('data-aviso-id') || '';
    inputIdEdit.value = id;
    inputIdDel.value = id;

    // Pré-preenche a partir do DOM do card
    const titulo = card.querySelector('.aviso-titulo')?.textContent?.trim() || '';
    const conteudo = card.querySelector('.aviso-conteudo')?.textContent?.trim() || '';
    inputTitulo.value = titulo;
    inputConteudo.value = conteudo;

    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    currentCard = null;
    formEdit.reset();
  }

  // Delegação: clicar no botão de editar do aviso
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.aviso-editar-btn');
    if (btn) {
      const card = btn.closest('.aviso-card');
      openModal(card);
    }
  });

  // Cancelar
  btnCancelar?.addEventListener('click', closeModal);

  // Fechar ao clicar fora
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // ESC fecha
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') {
      closeModal();
    }
  });

  // Confirmação de exclusão
  formDelete?.addEventListener('submit', (e) => {
    if (!confirm('Tem certeza que deseja excluir este aviso?')) {
      e.preventDefault();
    }
  });

  // Opcional: após salvar, você pode fechar o modal (se o envio for ajax)
  // formEdit.addEventListener('submit', async (e) => {
  //   e.preventDefault();
  //   const data = new FormData(formEdit);
  //   const res = await fetch(formEdit.action, { method: 'POST', body: data });
  //   if (res.ok) closeModal();
  // });
});