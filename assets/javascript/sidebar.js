// Navbar toggle
    const sidebar = document.getElementById("sidebar");
    const menuBtn = document.getElementById("menu-btn");

    menuBtn.addEventListener("click", () => {
      sidebar.classList.toggle("expanded");
    });