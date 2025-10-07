function toggleCard(button) {
    const card = button.closest(".card");
    card.classList.toggle("expanded");
    const resumolabel = card.querySelector(".resumo-label");
    if (resumolabel) {
      resumolabel.style.display = card.classList.contains("expanded") ? "none" : "block";
    }
    const isOpen = card.classList.contains("expanded");
    button.textContent = isOpen ? "Ver menos" : "Ver mais";
  }