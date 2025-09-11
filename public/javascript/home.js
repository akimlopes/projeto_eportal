    // Profile dropdown toggle
    const profileBtn = document.getElementById("profile-btn");
    const profileMenu = document.getElementById("profile-menu");

    profileBtn.addEventListener("click", () => {
      profileMenu.classList.toggle("active");
    });

    // Fecha o menu de perfil ao clicar fora
    document.addEventListener("click", (e) => {
      if (!profileBtn.contains(e.target) && !profileMenu.contains(e.target)) {
        profileMenu.classList.remove("active");
      }
    });