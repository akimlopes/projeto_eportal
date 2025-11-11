document.addEventListener('DOMContentLoaded', function(){
    const toggleBtn = document.getElementById('toggle-requests');
    const requestsPanel = document.getElementById('requests-panel');
    const membersList = document.getElementById('members-list');

    if (toggleBtn){
        toggleBtn.addEventListener('click', function(){
            const showing = !requestsPanel.classList.contains('hidden');
            if (showing){
                // voltar para membros
                requestsPanel.classList.add('hidden');
                membersList.classList.remove('hidden');
                toggleBtn.textContent = 'Solicitações';
            } else {
                // mostrar solicitações
                requestsPanel.classList.remove('hidden');
                membersList.classList.add('hidden');
                toggleBtn.textContent = 'Integrantes';
            }
        });
    }

    // Hooks para botões de aceitar/recusar (visual apenas)
    document.body.addEventListener('click', function(e){
        if (e.target.matches('.btn-accept')){
            e.target.textContent = 'Aceito';
            e.target.disabled = true;
            // Aqui você pode adicionar chamadas fetch quando integrar com backend
        }
        if (e.target.matches('.btn-reject')){
            e.target.textContent = 'Recusado';
            e.target.disabled = true;
        }
    });
});