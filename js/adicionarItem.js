function EnviarItem() {
    const nome = document.getElementById('input_nome').value.toLowerCase();
    const codigo = document.getElementById('input_codigo').value;
    const complemento = document.getElementById('input_complemento').value;
    const quantidade = document.getElementById('input_quantidade').value;
    const segmento = $('#input_segmento').val();
    const unidade = document.getElementById('input_unidade').value;

    if (!nome || !codigo || !segmento || !complemento || !unidade || !quantidade) {
        alert("Todos os campos precisam ser preenchidos!");
        return;
    }

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
    })
    .catch(err => {
        console.error('Erro ao enviar:', err);
        alert('Erro ao enviar o item.');
    });
}