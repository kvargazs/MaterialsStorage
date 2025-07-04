function AdicionarUsuario() {
    const nome_usuario = document.getElementById('input_nome_usuario').value.toLowerCase();
    const senha_usuario = document.getElementById('input_senha_usuario').value;
    const tipo_usuario = document.getElementById('select_tipo_usuario').value;


    if (!nome_usuario || !senha_usuario) {
        alert("Todos os campos precisam ser preenchidos!");
        return;
    }


    // Envia para o backend
    fetch('http://localhost:5000/adicionarusuario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            nome_usuario,
            senha_usuario,
            tipo_usuario
        })
    })
    .then(res => res.text())
    .then(msg => {
        alert(msg);
        document.getElementById('input_nome_usuario').value = '';
        document.getElementById('input_senha_usuario').value = '';
    })
    .catch(err => {
        console.error('Erro ao enviar:', err);
        alert('Erro ao cadastrar usuário.');
    });
}