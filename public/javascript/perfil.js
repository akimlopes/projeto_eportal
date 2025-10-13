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
document.addEventListener('DOMContentLoaded', () => {
  // Chips e seções
  const chipContato = document.getElementById('chip-contato');
  const chipCurso   = document.getElementById('chip-curso');
  const secContato  = document.getElementById('sec-contato');
  const secCurso    = document.getElementById('sec-curso');

  function openSection(which) {
    const contato = which === 'contato';
    if (secContato) secContato.style.display = contato ? 'block' : 'none';
    if (secCurso) secCurso.style.display = contato ? 'none' : 'block';
    chipContato?.classList.toggle('active', contato);
    chipCurso?.classList.toggle('active', !contato);
  }

  chipContato?.addEventListener('click', () => openSection('contato'));
  chipCurso?.addEventListener('click',   () => openSection('curso'));
  openSection('contato'); // seção inicial

  // Senha (editar/cancelar/salvar)
  const btnEditar   = document.getElementById('btn-editar');
  const btnCancelar = document.getElementById('btn-cancelar');
  const btnSalvar   = document.getElementById('btn-salvar');

  const trocaArea   = document.getElementById('troca-senha-area');
  const senhaAtual  = document.getElementById('senha-atual-input');
  const novaSenha   = document.getElementById('nova-senha');
  const confSenha   = document.getElementById('confirma-senha');
  const msgErro     = document.getElementById('senha-erro');

  function enterEdit() {
    if (!trocaArea) return;
    trocaArea.style.display = 'block';
    btnEditar && (btnEditar.style.display = 'none');
    btnCancelar && (btnCancelar.style.display = 'inline-block');
    btnSalvar && (btnSalvar.style.display = 'inline-block');
    senhaAtual?.focus();
  }

  function leaveEdit() {
    if (!trocaArea) return;
    trocaArea.style.display = 'none';
    [senhaAtual, novaSenha, confSenha].forEach(i => i && (i.value = ''));
    msgErro && (msgErro.style.display = 'none');
    btnEditar && (btnEditar.style.display = 'inline-block');
    btnCancelar && (btnCancelar.style.display = 'none');
    btnSalvar && (btnSalvar.style.display = 'none');
  }

  btnEditar?.addEventListener('click', enterEdit);
  btnCancelar?.addEventListener('click', leaveEdit);

  btnSalvar?.addEventListener('click', () => {
    const a = senhaAtual?.value || '';
    const n = novaSenha?.value || '';
    const c = confSenha?.value || '';

    if (!a || !n || !c) {
      if (msgErro) { msgErro.textContent = 'Preencha todos os campos.'; msgErro.style.display = 'block'; }
      return;
    }
    if (n !== c) {
      if (msgErro) { msgErro.textContent = 'As senhas não coincidem.'; msgErro.style.display = 'block'; }
      return;
    }
    if (msgErro) msgErro.style.display = 'none';

    // Exemplo de integração:
    // fetch('/perfil/senha', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ atual: a, nova: n }) })
    //   .then(r => r.ok ? leaveEdit() : alert('Erro ao atualizar senha'));

    alert('Senha validada (mock). Integre com o backend.');
    leaveEdit();
  });
});