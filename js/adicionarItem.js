function EnviarItem() {
    const nome = document.getElementById('input_nome').value.toLowerCase();
    const codigo = document.getElementById('input_codigo').value;
    const complemento = document.getElementById('input_complemento').value;
    const quantidade = document.getElementById('input_quantidade').value;
    
    // Segmento permite múltiplas opções (via Select2)
    const segmento = document.getElementById('input_segmento').value;

    // Unidade é seleção simples
    const unidade = document.getElementById('input_unidade').value;

    // Validação
    if (!nome || !codigo || !segmento || !complemento || !unidade || !quantidade) {
        alert("Todos os campos precisam ser preenchidos!");
        return;
    }

    // Envia para o backend
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
    .then(res => res.text())
    .then(msg => {
        alert(msg);
        document.getElementById("formulario").reset();
    })
    .catch(err => {
        console.error('Erro ao enviar:', err);
        alert('Erro ao enviar o item.');
    });
}