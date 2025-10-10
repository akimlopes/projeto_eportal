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
    const id = card?.dataset?.avisoId || card?.getAttribute('aviso-id') || '';
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

  // Exclusão de aviso
  formDelete?.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!confirm('Tem certeza que deseja excluir este aviso?')) return;

    const id = inputIdDel.value;
    if (!id) {
      alert("Erro: ID do aviso não encontrado.");
      return;
    }

    try {
      const res = await fetch('/avisos/excluir', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });

      if (res.ok) {
        alert('Aviso excluído com sucesso!');
        currentCard?.remove();  // Remove o card da tela
        closeModal();
      } else {
        const msg = await res.text();
        alert(`Erro: ${msg}`);
      }
    } catch (err) {
      console.error(err);
      alert('Erro ao tentar excluir o aviso.');
    }
  });
});

// Conteúdo limite do post (mantido)
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
