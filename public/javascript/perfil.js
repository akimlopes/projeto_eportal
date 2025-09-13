// JS para liberar edição e cancelar

document.addEventListener('DOMContentLoaded', function () {
    const trocaSenhaArea = document.getElementById('troca-senha-area');
    const btnTrocarSenha = document.getElementById('btn-trocar-senha');
    const btnEditar = document.getElementById('btn-editar');
    const btnSalvar = document.getElementById('btn-salvar');
    const btnCancelar = document.getElementById('btn-cancelar');
    const inputs = document.querySelectorAll('.input-perfil');
    const senha = document.getElementById('senha-usuario');
    const senhaErro = document.getElementById('senha-erro');

    // Salva valores originais

    const valoresOriginais = Array.from(inputs).map(i => i.value);
    btnEditar.addEventListener('click', function () {
        inputs.forEach(i => i.disabled = false);
        btnEditar.style.display = 'none';
        btnSalvar.style.display = 'inline-block';
        btnCancelar.style.display = 'inline-block';
        btnTrocarSenha.style.display = 'inline-block';
        senha.disabled = true;
    });

    // Cancelar restaura valores originais e desabilita inputs

    btnCancelar.addEventListener('click', function () {
        inputs.forEach((i, idx) => {
            i.value = valoresOriginais[idx];
            i.disabled = true;
            btnTrocarSenha.style.display = 'none';
        });
        btnEditar.style.display = 'inline-block';
        btnSalvar.style.display = 'none';
        btnCancelar.style.display = 'none';
        trocaSenhaArea.style.display = 'none';
        senha.style.display = 'block';
        senhaErro.textContent = '';
    });
});
document.addEventListener('DOMContentLoaded', function () {
    const senha = document.getElementById('senha-usuario');
    const btnTrocarSenha = document.getElementById('btn-trocar-senha');
    const trocaSenhaArea = document.getElementById('troca-senha-area');
    const novaSenha = document.getElementById('nova-senha');
    const confirmaSenha = document.getElementById('confirma-senha');
    const senhaErro = document.getElementById('senha-erro');
    const btnSalvar = document.getElementById('btn-salvar');

// Habilita área de troca de senha

    btnTrocarSenha.addEventListener('click', function () {
        trocaSenhaArea.style.display = 'block';
        novaSenha.disabled = false;
        confirmaSenha.disabled = false;
        btnTrocarSenha.style.display = 'none';
        senha.style.display = 'none';
    });

    btnSalvar.addEventListener('click', function (e) {
        if (trocaSenhaArea.style.display === 'block') {
            if (novaSenha.value !== confirmaSenha.value) {
                senhaErro.textContent = 'As senhas não coincidem.';
                e.preventDefault();
                return false;
            } else if (!novaSenha.value || !confirmaSenha.value) {
                senhaErro.textContent = 'Preencha ambos os campos de senha.';
                e.preventDefault();
                return false;
            } else {
                senhaErro.textContent = '';
            }
        }
    });
});