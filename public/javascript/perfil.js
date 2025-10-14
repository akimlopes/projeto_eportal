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
    
    const inputs = document.querySelectorAll('#sec-contato .input');
    const trocaSenhaArea = document.getElementById('troca-senha-area');
    const senha = document.querySelector('.senha-wrapper .input');
    const senhaAtual = document.getElementById('senha-atual-input');
    const novaSenha = document.getElementById('nova-senha');
    const confirmaSenha = document.getElementById('confirma-senha');
    const senhaErro = document.getElementById('senha-erro');
    const fotoIcone = document.getElementById('foto-icone'); // ícone de câmera ou botão
    const inputArquivo = document.getElementById('input-foto'); // input file escondido
    const imgPerfil = document.getElementById('img-perfil'); // imagem atual do perfil

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

    chipContato?.addEventListener('click', () => openSection('contato'));
    chipCurso?.addEventListener('click', () => openSection('curso'));
    openSection('contato');

    function enterEditMode() {
        openSection('contato');
        inputs.forEach(i => {
            if (i.id !== 'senha-input') {
                i.disabled = false;
            }
        });
        btnEditar.style.display = 'none';
        btnSalvar.style.display = 'inline-block';
        btnCancelar.style.display = 'inline-block';

        if (senha) {
            senha.disabled = true;
            senha.style.display = 'block';
        }
        if (trocaSenhaArea) {
            trocaSenhaArea.style.display = 'block';
        }
        if (senhaAtual) senhaAtual.disabled = false;
        if (novaSenha) novaSenha.disabled = false;
        if (confirmaSenha) confirmaSenha.disabled = false;
    }

    function leaveEditMode() {
        inputs.forEach((i, idx) => {
            i.value = valoresOriginais[idx];
            i.disabled = true;
        });
        btnEditar.style.display = 'inline-block';
        btnSalvar.style.display = 'none';
        btnCancelar.style.display = 'none';

        if (trocaSenhaArea) trocaSenhaArea.style.display = 'none';
        if (senha) {
            senha.disabled = true;
            senha.style.display = 'block';
        }
        if (senhaErro) {
            senhaErro.textContent = '';
            senhaErro.style.display = 'none';
        }
        [senhaAtual, novaSenha, confirmaSenha].forEach(i => i && (i.value = ''));
    }

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

    btnEditar?.addEventListener('click', enterEditMode);
    btnCancelar?.addEventListener('click', leaveEditMode);

    btnSalvar?.addEventListener('click', function(e) {
        if (trocaSenhaArea && trocaSenhaArea.style.display === 'block') {
            if (!validatePasswordChange()) {
                e.preventDefault();
                return false;
            }
            alert('Senha validada com sucesso! Integre com o backend para salvar.');
            leaveEditMode();
        }
    });

    //Upload de imagem de perfil
    if (fotoIcone && inputArquivo) {

        // Quando o usuário clicar no ícone, abre o seletor de arquivos
        fotoIcone.addEventListener('click', () => {
            inputArquivo.click();
        });

        // Quando selecionar uma imagem
        inputArquivo.addEventListener('change', async (e) => {
            const arquivo = e.target.files[0];
            if (!arquivo) return;

            const formData = new FormData();
            formData.append('foto', arquivo);

            try {
                const res = await fetch('/perfil/upload-foto', {
                    method: 'POST',
                    body: formData
                });

                if (res.ok) {
                    const data = await res.json();
                    // Atualiza imagem exibida no perfil
                    imgPerfil.src = data.url;
                    alert('Foto atualizada com sucesso!');
                } else {
                    const msg = await res.text();
                    alert(`Erro ao enviar imagem: ${msg}`);
                }
            } catch (err) {
                console.error(err);
                alert('Erro ao enviar imagem.');
            }
        });
    }
});
