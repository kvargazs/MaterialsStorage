async function fazerLogin() {
    const nome = document.getElementById('login_nome_input').value;
    const senha = document.getElementById('login_senha_input').value;





    // Validação
    if (!nome || !senha) {
        alert("Todos os campos precisam ser preenchidos!");
        return;
    }

    // Envia para o backend
    fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            nome,
            senha
        })
    })
    .then(res => res.json())
    .then(data => {
        if (data.sucesso) {
            window.location.href = 'home.html';
        } else {
            alert(data.mensagem || "Falha no login.");
        }
    })
    .catch(err => {
        console.error('Erro ao enviar:', err);
        alert('Erro ao fazer login.');
    });







    

    // // Validação
    // if (!nome || !senha) {
    //     alert("Todos os campos precisam ser preenchidos!");
    //     return;
    // }

    // // Envia para o backend
    // fetch('http://localhost:5000/login', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({
    //         nome,
    //         senha   // array
    //     })
    // })
    // .then(res => res.text())
    // .then(msg => {
    //     alert(msg);
    //     //document.getElementById("formulario").reset();
    //     window.location.href = 'home.html';
    // })
    // .catch(err => {
    //     console.error('Erro ao enviar:', err);
    //     alert('Erro ao fazer login.');
    // });



    

    // try {
    //     const resposta = await fetch('/login', {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json'
    //         },
    //         body: JSON.stringify({ nome, senha })
    //     });

    //     const dados = await resposta.json();

    //     if (resposta.ok && dados.sucesso) {
    //         alert('Login realizado com sucesso!');
    //         // Redirecionar, por exemplo:
    //         // window.location.href = '/dashboard';
    //     } else {
    //         alert('Nome ou senha inválidos.');
    //     }
    // } catch (erro) {
    //     console.error('Erro ao tentar fazer login:', erro);
    //     alert('Erro no servidor.');
    // }
}
