document.addEventListener('DOMContentLoaded', () => {

    //Pega o item do localStorage
    const itemJSON = localStorage.getItem('itemParaEditar');

    const item = JSON.parse(itemJSON);

    console.log('Item completo do localStorage:', item);
    console.log('Valor de item.unidade:', item.unidade);
    console.log('Valor de item.segmento (do localStorage):', item.segmento);

    //Pega os elementos do form
    const inputNome = document.getElementById('input_nome');
    const inputCodigo = document.getElementById('input_codigo');
    const inputComplemento = document.getElementById('input_complemento');
    const inputQuantidade = document.getElementById('input_quantidade');
    
    const btnSalvar = document.getElementById('btnSalvar');

    if (!inputNome || !inputCodigo || !inputComplemento || !inputQuantidade || !btnSalvar) {
        alert('Campos do formulário não encontrados na página.');
        return;
    }

    // Preenche os inputs com os dados do item
    inputNome.value = item.nome || '';
    inputCodigo.value = item.codigo || '';
    inputComplemento.value = item.complemento || '';
    inputQuantidade.value = item.quantidade || 0;

    //Preenche os selects de unidade e segmento
const inputUnidade = document.getElementById('input_unidade');
const inputSegmento = document.getElementById('input_segmento');

    //Código fica desabilitado pra edicao
    inputCodigo.disabled = true;

    btnSalvar.addEventListener('click', async () => {
        const nome = inputNome.value.trim();
        const codigo = inputCodigo.value.trim();
        const complemento = inputComplemento.value.trim();
        const quantidade = parseInt(inputQuantidade.value, 10);
        const unidade = inputUnidade.value.trim();
        const segmento = inputSegmento.value.trim();

        if (!nome || !codigo || isNaN(quantidade) || quantidade < 0) {
            alert('Preencha todos os campos corretamente.');
            return;
        }

        //objeto para envio
        const dadosAtualizados = {
            nome,
            complemento,
            quantidade,
            unidade,
            segmento
        };

        try {
        const response = await fetch(`http://localhost:5000/itens/${codigo}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dadosAtualizados)
        });

        if (response.ok) {
            alert('Item atualizado com sucesso!');
            localStorage.removeItem('itemParaEditar'); // limpa localStorage
            window.location.href = 'home.html'; // volta pra home
        } else {
            const erro = await response.json();
            alert(erro.message || 'Erro ao atualizar item.');
        }

        } catch (error) {
            alert('Erro de conexão com o servidor.');
            console.error(error);
        }
    });
});