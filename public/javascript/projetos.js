function toggleCard(button) {
    const card = button.closest(".card");
    card.classList.toggle("expanded");
    const isOpen = card.classList.contains("expanded");
    button.textContent = isOpen ? "Ver menos" : "Ver mais";
  }