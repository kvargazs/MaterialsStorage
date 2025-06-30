async function fazerLogin() {
    const nome = document.getElementById('login_nome_input').value;
    const senha = document.getElementById('login_senha_input').value;

    try {
        const resposta = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nome, senha })
        });

        const dados = await resposta.json();

        if (resposta.ok && dados.sucesso) {
            alert('Login realizado com sucesso!');
            // Redirecionar, por exemplo:
            // window.location.href = '/dashboard';
        } else {
            alert('Nome ou senha inválidos.');
        }
    } catch (erro) {
        console.error('Erro ao tentar fazer login:', erro);
        alert('Erro no servidor.');
    }
}
