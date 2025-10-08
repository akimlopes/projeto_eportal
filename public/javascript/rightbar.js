// Profile dropdown toggle
    const profileBtn = document.getElementById("profile-btn");
    const profileMenu = document.getElementById("profile-menu");
    const bgmenu = document.getElementById("profile");
    const profileExpand = document.getElementById("profileExpand");
    const profileName = document.getElementById("profile-name");

    profileExpand.addEventListener("click", () => {
  profileMenu.classList.toggle("active");
  if (profileMenu.classList.contains("active")) {
    bgmenu.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
    bgmenu.style.backgroundColor = 'var(--main-red)';
    profileName.style.opacity = '1';
    profileName.style.display = 'flex';
    bgmenu.style.width = '200px';
  } else {
    bgmenu.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.0)';
    profileName.style.opacity = '0';
    bgmenu.style.backgroundColor = 'transparent';
    profileName.style.display = 'none';
    bgmenu.style.width = '70px';
  }
});

// Fecha o menu de perfil ao clicar fora
document.addEventListener("click", (e) => {
  if (!profileBtn.contains(e.target) && !profileMenu.contains(e.target)) {
    profileMenu.classList.remove("active");
    bgmenu.style.backgroundColor = 'transparent';
    profileName.style.opacity = '0';
    bgmenu.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.0)';
    profileName.style.display = 'none';
    bgmenu.style.width = '70px';
  }
});

    //modal de postagem

    document.addEventListener('DOMContentLoaded', function() {
  const fab = document.querySelector('.fab');
  const modal = document.getElementById('modal-post');
  const btnCancelar = document.getElementById('btn-cancelar-modal');
  const formPost = document.getElementById('form-post');

  fab.addEventListener('click', function() {
    modal.classList.add('active');
  });

  btnCancelar.addEventListener('click', function() {
    modal.classList.remove('active');
    formPost.reset();
  });

  /*// Exemplo de envio (substitua pelo envio real ao backend)
  formPost.addEventListener('submit', function(e) {
    e.preventDefault();
    // Aqui você pode enviar via fetch/AJAX para o backend
    // Após sucesso, fecha o modal e atualiza a lista de avisos
    modal.classList.remove('active');
    formPost.reset();
    alert('Aviso postado com sucesso!');
  });
});*/

document.addEventListener('DOMContentLoaded', () => {
  const formPost = document.getElementById('form-post');
  const modal = document.querySelector('.modal'); // ajuste se sua classe/selector for diferente

  if (!formPost) return;

  formPost.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(formPost);

    try {
      const res = await fetch('/upload', {
        method: 'POST',
        body: fd,
        headers: { 'Accept': 'application/json' }
      });

      if (!res.ok) {
        const text = await res.text().catch(() => null);
        throw new Error(text || 'Erro no upload');
      }

      const data = await res.json();
      alert('Aviso publicado com sucesso!');
      formPost.reset();
      if (modal) modal.classList.remove('active');
      // recarrega para mostrar o novo aviso (ou atualize dinamicamente o DOM)
      window.location.reload();
    } catch (err) {
      console.error('Erro ao postar aviso:', err);
      alert('Erro ao postar aviso. Veja console para detalhes.');
    }
  });

  // botão cancelar (se existir)
  const btnCancelar = document.getElementById('btn-cancelar-modal');
  if (btnCancelar) btnCancelar.addEventListener('click', () => {
    formPost.reset();
    if (modal) modal.classList.remove('active');
  });
});})