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

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.aviso-editar-btn');
    if (btn) {
      const card = btn.closest('.aviso-card');
      openModal(card);
    }
  });

  btnCancelar?.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') {
      closeModal();
    }
  });

  //Excluir aviso
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
        currentCard?.remove();
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

//Editar Aviso
  formEdit?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const id = inputIdEdit.value;
    const titulo = inputTitulo.value.trim();
    const conteudo = inputConteudo.value.trim();

    if (!id || !titulo || !conteudo) {
      alert('Preencha todos os campos antes de salvar.');
      return;
    }

    try {
      // Envia para o backend atualizar
      const res = await fetch('/avisos/editar', {
        method: 'POST', // use PUT se o backend estiver configurado assim
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, titulo, conteudo })
      });

      if (res.ok) {
        // Atualiza diretamente no DOM
        currentCard.querySelector('.aviso-titulo').textContent = titulo;
        currentCard.querySelector('.aviso-conteudo').textContent = conteudo;

        alert('Aviso atualizado com sucesso!');
        closeModal();
      } else {
        const msg = await res.text();
        alert(`Erro: ${msg}`);
      }
    } catch (err) {
      console.error(err);
      alert('Erro ao atualizar o aviso.');
    }
  });
});
