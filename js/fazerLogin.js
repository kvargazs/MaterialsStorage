// Preenche o nome do modal com o valor já digitado no campo de login (se existir)
function preencherNomeModal() {
    const nomeInput = document.getElementById("login_nome_input").value.trim();
    const nomeModal = document.getElementById("nomeUsuarioModal");
    nomeModal.value = nomeInput;
}

// Mostra o modal de recuperação
function mostrarFormularioRecuperacao() {
    preencherNomeModal();
    const modal = new bootstrap.Modal(document.getElementById("recuperarSenhaModal"));
    modal.show();
}

// Trocar a senha do usuário
async function trocarSenha(event) {
    event.preventDefault();

    const nome = document.getElementById("nomeUsuarioModal").value.trim();
    const novaSenha = document.getElementById("novaSenhaModal").value.trim();

    if (!nome) {
        alert("Por favor, digite o nome de usuário.");
        return;
    }

    if (!novaSenha) {
        alert("Por favor, insira a nova senha.");
        return;
    }

    try {
        const res = await fetch('http://localhost:5000/alterarsenha', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome, novaSenha })
        });

        const data = await res.json();

        if (data.sucesso) {
            alert("Senha alterada com sucesso!");
            const modalElement = document.getElementById("recuperarSenhaModal");
            const modal = bootstrap.Modal.getInstance(modalElement);
            modal.hide();
            document.getElementById("novaSenhaModal").value = "";
        } else {
            alert(data.mensagem || "Erro ao alterar a senha.");
        }
    } catch (err) {
        console.error("Erro ao alterar a senha:", err);
        alert("Erro ao tentar alterar a senha.");
    }
}

// Fazer login
async function fazerLogin() {
    const nome = document.getElementById('login_nome_input').value.trim();
    const senha = document.getElementById('login_senha_input').value.trim();

    if (!nome || !senha) {
        alert("Todos os campos precisam ser preenchidos!");
        return;
    }

    try {
        const res = await fetch('http://localhost:5000/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome, senha })
        });

        const data = await res.json();

        if (data.sucesso) {
            const usuario = data.usuario;
            localStorage.setItem('usuario', JSON.stringify(usuario));
            window.location.href = 'home.html';
        } else {
            alert(data.mensagem || "Falha no login.");
        }

    } catch (err) {
        console.error('Erro ao enviar:', err);
        alert('Erro ao fazer login.');
    }
}

// ----------- EVENTOS -----------
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("btnLogin").addEventListener("click", fazerLogin);
    document.getElementById("btnEsqueciSenha").addEventListener("click", (e) => {
        e.preventDefault();
        mostrarFormularioRecuperacao();
    });
    document.getElementById("formRecuperarSenha").addEventListener("submit", trocarSenha);
});

// Torna funções disponíveis no escopo global se necessário
window.mostrarFormularioRecuperacao = mostrarFormularioRecuperacao;
window.trocarSenha = trocarSenha;
window.fazerLogin = fazerLogin;