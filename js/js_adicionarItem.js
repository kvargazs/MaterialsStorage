// Função para enviar os dados para o servidor
function EnviarItem() {
    //const nome = document.getElementById('input_nome').value;
    const nome = document.getElementById('input_nome').value.toLowerCase();
    const codigo = document.getElementById('input_codigo').value;
    const segmento = document.getElementById('input_segmento').value;
    const complemento = document.getElementById('input_complemento').value;
    const unidade = document.getElementById('input_unidade').value;
    const quantidade = document.getElementById('input_quantidade').value;

    // Verifica se todos os campos estão preenchidos antes de enviar
    if (!nome || !codigo || !segmento || !complemento || !unidade || !quantidade) {
        alert("Todos os campos precisam ser preenchidos!");
        return;
    }

    // Envia os dados para o servidor via POST
    fetch('http://localhost:5000/inserir', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            nome, 
            codigo, 
            segmento, 
            complemento, 
            unidade, 
            quantidade
        })
    })
    .then(res => res.text())  // Resposta do servidor como texto
    .then(msg => {
        alert(msg);  // Exibe a mensagem retornada pelo servidor
    })
    .catch(err => {
        console.error('Erro ao enviar:', err);
        alert('Erro ao enviar o item.');
    });
}