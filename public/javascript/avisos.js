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

});
//#
document.addEventListener('DOMContentLoaded', function() {
  const MAX = 500;
  const conteudo = document.getElementById('conteudo');
  const counter = document.getElementById('conteudo-count');
  const formPost = document.getElementById('form-post');

  if (conteudo && counter) {
    const update = () => {
      const len = conteudo.value.length;
      counter.textContent = len;
      counter.parentElement.classList.toggle('warn', len >= MAX);
    };
    conteudo.addEventListener('input', update);
    update();
  }

  if (formPost) {
    formPost.addEventListener('submit', function(e) {
      const len = (conteudo?.value || '').length;
      if (len > MAX) {
        e.preventDefault();
        alert(`O conteúdo pode ter no máximo ${MAX} caracteres.`);
      }
    });
  }
});