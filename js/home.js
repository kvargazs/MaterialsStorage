// SIDEBAR
var currentPath = window.location.pathname;
var links = document.querySelectorAll('.nav-link');
links.forEach(function (link) {
    if (link.getAttribute('href') === currentPath || currentPath.includes(link.getAttribute('href'))) {
        link.classList.add('active');
    }
});

// Variável global para armazenar o item selecionado
let itemSelecionado = null;

document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("search");
    const searchButton = document.getElementById("buscarBtn");

    // Eventos de busca por texto
    searchInput.addEventListener("input", pesquisarItens);
    searchButton.addEventListener("click", pesquisarItens);
    searchInput.addEventListener("keydown", function (event) {
        if  (event.key === "Enter") {
            pesquisarItens();
        }
    });

    //Botão de aplicar filtro
    document.getElementById("aplicarFiltroBtn").addEventListener("click", aplicarFiltros);

    //Botão de limpar filtro
    document.getElementById("limparFiltroBtn").addEventListener("click", function (e) {
        e.stopPropagation(); //não fecha o dropdown
        limparFiltros();
    });



    //PARA DAR BAIXA E MUDAR A QUANTIDADE NO DB
    const inputQuantidadeBaixa = document.getElementById('quantidadeBaixa');
    const confirmarBaixaBtn = document.getElementById('confirmarBaixaBtn');
    const btnDarBaixa = document.getElementById('btnDarBaixa');

    btnDarBaixa.addEventListener('click', function () {
        if (!itemSelecionado) return;

        document.getElementById('nomeCodigoBaixa').innerHTML = `<strong>Item: </strong> ${itemSelecionado.nome} (Código: ${itemSelecionado.codigo})`;

        document.getElementById('quantidadeAtualBaixa').innerHTML = `<strong>Quantidade atual: </strong> ${itemSelecionado.quantidade}`;

        inputQuantidadeBaixa.setAttribute('min', '1');
        inputQuantidadeBaixa.setAttribute('max', itemSelecionado.quantidade);
        inputQuantidadeBaixa.value = '';

        const darBaixaModal = new bootstrap.Modal(document.getElementById('darBaixaModal'));
        darBaixaModal.show();

        document.getElementById('darBaixaModal').addEventListener('shown.bs.modal', () => {
            inputQuantidadeBaixa.focus();
        }, { once: true });

        const itemModalEl = document.getElementById('itemModal');
        const itemModalInstance = bootstrap.Modal.getInstance(itemModalEl);
        if (itemModalInstance) itemModalInstance.hide();
    });

    confirmarBaixaBtn.addEventListener('click', async () => {
        if (!itemSelecionado) {
            alert('Nenhum item selecionado!');
            return;
        }

        const quantidadeDigitada = parseInt(inputQuantidadeBaixa.value, 10);
        if (isNaN(quantidadeDigitada) || quantidadeDigitada <= 0) {
            alert('Digite uma quantidade válida!');
            return;
        }

        const quantidadeAtual = Number(itemSelecionado.quantidade);
        if (quantidadeDigitada > quantidadeAtual) {
            alert(`A quantidade para baixa não pode ser maior que a quantidade atual (${quantidadeAtual}).`);
            return;
        }

        const quantidadeFinal = quantidadeAtual - quantidadeDigitada;

        try {
            const response = await fetch(`http://localhost:5000/itens/${itemSelecionado.codigo}/quantidade`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ quantidade: quantidadeFinal })
            });

            const data = await response.json();
            if (response.ok) {
                alert('Quantidade atualizada com sucesso!');
                itemSelecionado.quantidade = quantidadeFinal;

                const darBaixaModal = bootstrap.Modal.getInstance(document.getElementById('darBaixaModal'));
                if (darBaixaModal) darBaixaModal.hide();

                carregarItens(); // recarrega com nova quantidade
            } else {
                alert(data.message || 'Erro ao atualizar quantidade.');
            }
        } catch (error) {
            console.error('Erro ao chamar API:', error);
            alert('Erro de conexão com o servidor.');
        }
    });



    // EXCLUIR ITEM
    const btnExcluir = document.getElementById('btnExcluir');

    btnExcluir.addEventListener('click', async () => {
        if (!itemSelecionado) {
            alert('Nenhum item selecionado!');
            return;
        }

        if (!confirm(`Tem certeza que deseja excluir o item "${itemSelecionado.nome}"?`)) {
            return;
        }

        try {
            const response = await fetch(`http://localhost:5000/itens/${itemSelecionado.codigo}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                alert('Item excluído com sucesso!');
                const itemModal = bootstrap.Modal.getInstance(document.getElementById('itemModal'));
                if (itemModal) itemModal.hide();

                carregarItens(); // Atualiza a lista de itens
            } else {
                const data = await response.json();
                alert(data.message || 'Erro ao excluir o item.');
            }
        } catch (error) {
            console.error('Erro ao chamar API:', error);
            alert('Erro de conexão com o servidor.');
        }
    });



    //EDITAR ITEM
    const btnEditar = document.getElementById('btnEditar'); // ou outro seletor correto

    btnEditar.addEventListener('click', () => {
    if (!itemSelecionado) {
        alert("Nenhum item selecionado para editar.");
        return;
    }

    const itemParaEditar = {
        id: itemSelecionado.id || null,
        nome: itemSelecionado.nome,
        segmento: itemSelecionado.segmento,
        complemento: itemSelecionado.complemento,
        quantidade: itemSelecionado.quantidade,
        unidade: itemSelecionado.unidade,
        codigo: itemSelecionado.codigo,
    };

    localStorage.setItem('itemParaEditar', JSON.stringify(itemParaEditar));
    window.location.href = 'editarItem.html';
    });


    // Inicializa tudo
    carregarItens();

    
    // Esconder botões de excluir e editar se o usuário não for adm
    const usuario = JSON.parse(localStorage.getItem('usuario'));

    if (!usuario || usuario.tipo !== 'adm') {
        // Esconde os botões se o tipo não for "adm"
        document.getElementById('btnEditar').style.display = 'none';
        document.getElementById('btnExcluir').style.display = 'none';
    }
});