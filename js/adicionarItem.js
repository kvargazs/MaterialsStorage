function EnviarItem() {
    const nome = document.getElementById('input_nome').value.toLowerCase();
    const codigo = document.getElementById('input_codigo').value;
    const complemento = document.getElementById('input_complemento').value;
    const quantidade = document.getElementById('input_quantidade').value;
<<<<<<< HEAD
    
    // Segmento permite múltiplas opções (via Select2)
    const segmento = $('input_segmento').val();  // array

    // Unidade é seleção simples
=======
    const segmento = $('#input_segmento').val();
>>>>>>> b77ee1ae65459ada326301d65ae1c7575ff8fa51
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