// Profile dropdown toggle
    const profileBtn = document.getElementById("profile-btn");
    const profileMenu = document.getElementById("profile-menu");
    const bgmenu = document.getElementById("profile");
    const profileExpand = document.getElementById("profileExpand");
    const profileName = document.getElementById("profile-name");

    profileExpand.addEventListener("click", () => {
  profileMenu.classList.toggle("active");
  if (profileMenu.classList.contains("active")) {
    bgmenu.style.backgroundColor = 'var(--main-red)';
    profileName.style.opacity = '1';
  } else {
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
