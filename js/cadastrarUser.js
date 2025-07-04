document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const recuperar = urlParams.get('recuperar');

    if (recuperar === '1') {
        document.getElementById('formCadastro').classList.add('d-none');
        document.getElementById('formRecuperar').classList.remove('d-none');
        document.getElementById('titulo').textContent = "Recuperar Senha";
    }

    function cadastrarUsuario() {
        const nome = document.getElementById('cadNome').value;
        const senha = document.getElementById('cadSenha').value;
        const tipo = document.getElementById('cadTipo').value;

        fetch('http://seu-backend.com/api/cadastrar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome, senha, tipo })
        })
        .then(res => res.json())
        .then(data => {
            document.getElementById('mensagem').textContent = data.mensagem || 'Cadastro realizado!';
        })
        .catch(err => {
            console.error(err);
            document.getElementById('mensagem').textContent = "Erro no cadastro.";
        });

        return false;
    }

    function recuperarSenha() {
        const nome = document.getElementById('recNome').value;
        const novaSenha = document.getElementById('recNovaSenha').value;

        fetch('http://seu-backend.com/api/redefinirSenha', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome, novaSenha })
        })
        .then(res => res.json())
        .then(data => {
            document.getElementById('mensagem').textContent = data.mensagem || 'Senha alterada!';
        })
        .catch(err => {
            console.error(err);
            document.getElementById('mensagem').textContent = "Erro ao alterar senha.";
        });

        return false;
    }
});