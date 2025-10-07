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
  } else {
    bgmenu.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.0)';
    profileName.style.opacity = '0';
    bgmenu.style.backgroundColor = 'transparent';
  }
});

// Fecha o menu de perfil ao clicar fora
document.addEventListener("click", (e) => {
  if (!profileBtn.contains(e.target) && !profileMenu.contains(e.target)) {
    profileMenu.classList.remove("active");
    bgmenu.style.backgroundColor = 'transparent';
    profileName.style.opacity = '0';
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

  // Exemplo de envio (substitua pelo envio real ao backend)
  formPost.addEventListener('submit', function(e) {
    e.preventDefault();
    // Aqui você pode enviar via fetch/AJAX para o backend
    // Após sucesso, fecha o modal e atualiza a lista de avisos
    modal.classList.remove('active');
    formPost.reset();
    alert('Aviso postado com sucesso!');
  });
});