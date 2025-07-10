document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const recuperar = urlParams.get('recuperar');

    if (recuperar === '1') {
        document.getElementById('formCadastro').classList.add('d-none');
        document.getElementById('formRecuperar').classList.remove('d-none');
        document.getElementById('titulo').textContent = "Recuperar Senha";
    }

    function cadastrarUsuario() {
        const nome = document.getElementById('cadNome').value.trim();
        const senha = document.getElementById('cadSenha').value.trim();
        const tipo = document.getElementById('cadTipo').value;
    
        if (!nome || !senha || !tipo) {
            document.getElementById('mensagem').textContent = "Por favor, preencha todos os campos.";
            return false;
        }
    
        fetch('http://seu-backend.com/api/adicionarusuario', {  // Ajuste da rota pra coincidir com seu backend
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome_usuario: nome, senha_usuario: senha, tipo_usuario: tipo })
        })
        .then(res => res.json())
        .then(data => {
            // Exibe mensagem de sucesso ou erro
            if (data.sucesso === false || data.message || data.mensagem) {
                document.getElementById('mensagem').textContent = data.mensagem || data.message || 'Erro no cadastro.';
            } else {
                document.getElementById('mensagem').textContent = 'Cadastro realizado com sucesso!';
                document.getElementById('formCadastro').reset();
            }
        })
        .catch(err => {
            console.error(err);
            document.getElementById('mensagem').textContent = "Erro no cadastro.";
        });
    
        return false; // evita o reload da página
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