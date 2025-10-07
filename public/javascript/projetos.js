function toggleCard(button) {
    const card = button.closest(".card");
    const allCards = document.querySelectorAll(".card");
    const resumolabel = card.querySelector(".resumo-label");

    // Fecha todos os outros cards e mostra o botão de ingressar neles
    allCards.forEach(c => {
        if (c !== card) {
            c.classList.remove("expanded");
            const btn = c.querySelector(".btn-ingressar");
            if (btn) btn.style.display = "flex";
        }
    });

    // Alterna o card clicado
    card.classList.toggle("expanded");

    // Esconde ou mostra o botão de ingressar no card atual
    const btnAtual = card.querySelector(".btn-ingressar");
    if (btnAtual) {
        resumolabel.style.display = card.classList.contains("expanded") ? "none" : "block";
        btnAtual.style.display = card.classList.contains("expanded") ? "none" : "flex";
    }
}