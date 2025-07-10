// Torna as funções acessíveis globalmente
function cadastrarUsuario() {
    const nome = document.getElementById('cadNome').value.trim();
    const senha = document.getElementById('cadSenha').value.trim();
    const tipo = document.getElementById('cadTipo').value;

    if (!nome || !senha || !tipo) {
        document.getElementById('mensagem').textContent = "Por favor, preencha todos os campos.";
        return false;
    }

    fetch('http://127.0.0.1:5000/adicionarusuario', {  // <- alterado aqui
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome_usuario: nome, senha_usuario: senha, tipo_usuario: tipo })
    })
    .then(res => res.json())
    .then(data => {
        if (!data.sucesso) {
            document.getElementById('mensagem').textContent = data.mensagem;
        } else {
            document.getElementById('mensagem').textContent = 'Cadastro realizado com sucesso!';
            document.getElementById('formCadastro').reset();
        }
    })
    .catch(err => {
        console.error('Erro ao cadastrar usuário:', err);
        document.getElementById('mensagem').textContent = "Erro no cadastro.";
    });

    return false; // evita recarregar a página
}


window.recuperarSenha = function () {
    const nome = document.getElementById('recNome').value;
    const novaSenha = document.getElementById('recNovaSenha').value;

    fetch('http://localhost:5000/alterarsenha', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, novaSenha })
    })
    .then(res => res.json())
    .then(data => {
        console.log("Resposta da redefinição:", data);
        document.getElementById('mensagem').textContent =
            data.mensagem || 'Senha alterada com sucesso!';
    })
    .catch(err => {
        console.error("Erro ao alterar senha:", err);
        document.getElementById('mensagem').textContent = "Erro ao alterar senha.";
    });

    return false;
};


// Executa ao carregar o DOM
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const recuperar = urlParams.get('recuperar');

    if (recuperar === '1') {
        document.getElementById('formCadastro').classList.add('d-none');
        document.getElementById('formRecuperar').classList.remove('d-none');
        document.getElementById('titulo').textContent = "Recuperar Senha";
    }
});