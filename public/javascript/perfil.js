// JS para perfil - funcionalidades de edição, troca de senha e navegação entre seções

document.addEventListener('DOMContentLoaded', function () {
    // Elementos da interface
    const chipContato = document.getElementById('chip-contato');
    const chipCurso = document.getElementById('chip-curso');
    const secContato = document.getElementById('sec-contato');
    const secCurso = document.getElementById('sec-curso');
    
    const btnEditar = document.getElementById('btn-editar');
    const btnSalvar = document.getElementById('btn-salvar');
    const btnCancelar = document.getElementById('btn-cancelar');
    // btnTrocarSenha removido - não existe no HTML
    
    // Seletor correto para capturar TODOS os inputs editáveis
    const inputs = document.querySelectorAll('#sec-contato .input');
    const trocaSenhaArea = document.getElementById('troca-senha-area');
    const senha = document.querySelector('.senha-wrapper .input'); // Campo de senha principal
    const senhaAtual = document.getElementById('senha-atual-input');
    const novaSenha = document.getElementById('nova-senha');
    const confirmaSenha = document.getElementById('confirma-senha');
    const senhaErro = document.getElementById('senha-erro');

    // Salva valores originais dos inputs
    const valoresOriginais = Array.from(inputs).map(i => i.value);

    // Função para alternar entre seções (Contato/Curso)
    function openSection(which) {
        const contato = which === 'contato';
        if (secContato) secContato.style.display = contato ? 'block' : 'none';
        if (secCurso) secCurso.style.display = contato ? 'none' : 'block';
        chipContato?.classList.toggle('active', contato);
        chipCurso?.classList.toggle('active', !contato);
    }

    // Event listeners para chips de navegação
    chipContato?.addEventListener('click', () => openSection('contato'));
    chipCurso?.addEventListener('click', () => openSection('curso'));
    openSection('contato'); // seção inicial

    // Função para entrar no modo de edição
    function enterEditMode() {
        // Força abertura da seção contato ao entrar no modo de edição
        openSection('contato');
        
        // Habilita TODOS os inputs EXCETO o campo de senha
        inputs.forEach(i => {
            if (i.id !== 'senha-input') {
                i.disabled = false;
            }
        });
        
        btnEditar.style.display = 'none';
        btnSalvar.style.display = 'inline-block';
        btnCancelar.style.display = 'inline-block';
        
        // Mantém o campo de senha desabilitado mas visível
        if (senha) {
            senha.disabled = true;
            senha.style.display = 'block';
        }
        
        // Mostra a área de troca de senha
        if (trocaSenhaArea) {
            trocaSenhaArea.style.display = 'block';
        }
        
        // Habilita campos de senha
        if (senhaAtual) senhaAtual.disabled = false;
        if (novaSenha) novaSenha.disabled = false;
        if (confirmaSenha) confirmaSenha.disabled = false;
    }

    // Função para sair do modo de edição
    function leaveEditMode() {
        // Restaura valores originais e desabilita TODOS os inputs
        inputs.forEach((i, idx) => {
            i.value = valoresOriginais[idx];
            i.disabled = true;
        });
        
        btnEditar.style.display = 'inline-block';
        btnSalvar.style.display = 'none';
        btnCancelar.style.display = 'none';
        
        // Esconde a área de troca de senha
        if (trocaSenhaArea) {
            trocaSenhaArea.style.display = 'none';
        }
        
        // Desabilita o campo de senha
        if (senha) {
            senha.disabled = true;
            senha.style.display = 'block';
        }
        
        if (senhaErro) {
            senhaErro.textContent = '';
            senhaErro.style.display = 'none';
        }
        
        // Limpa campos de senha
        [senhaAtual, novaSenha, confirmaSenha].forEach(i => i && (i.value = ''));
    }

    // Função para validar troca de senha
    function validatePasswordChange() {
        const atual = senhaAtual?.value || '';
        const nova = novaSenha?.value || '';
        const confirma = confirmaSenha?.value || '';

        if (!atual || !nova || !confirma) {
            if (senhaErro) {
                senhaErro.textContent = 'Preencha todos os campos de senha.';
                senhaErro.style.display = 'block';
            }
            return false;
        }

        if (nova !== confirma) {
            if (senhaErro) {
                senhaErro.textContent = 'As senhas não coincidem.';
                senhaErro.style.display = 'block';
            }
            return false;
        }

        if (senhaErro) senhaErro.style.display = 'none';
        return true;
    }

    // Event listeners para botões
    btnEditar?.addEventListener('click', enterEditMode);
    btnCancelar?.addEventListener('click', leaveEditMode);

    btnSalvar?.addEventListener('click', function(e) {
        // Se a área de troca de senha estiver visível, valida a senha
        if (trocaSenhaArea && trocaSenhaArea.style.display === 'block') {
            if (!validatePasswordChange()) {
                e.preventDefault();
                return false;
            }
            
            // Aqui você pode integrar com o backend
            // fetch('/perfil/senha', { 
            //     method: 'POST', 
            //     headers: { 'Content-Type': 'application/json' }, 
            //     body: JSON.stringify({ atual: senhaAtual.value, nova: novaSenha.value }) 
            // }).then(r => r.ok ? leaveEditMode() : alert('Erro ao atualizar senha'));
            
            alert('Senha validada com sucesso! Integre com o backend para salvar.');
            leaveEditMode();
        }
    });
});