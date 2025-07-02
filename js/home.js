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
        if (event.key === "Enter") {
            pesquisarItens();
        }
    });

    // Botão de aplicar filtro
    document.getElementById("aplicarFiltroBtn").addEventListener("click", aplicarFiltros);

    // Botão de limpar filtro
    document.getElementById("limparFiltroBtn").addEventListener("click", function (e) {
        e.stopPropagation(); // Evita fechar o dropdown
        limparFiltros();
    });

    // --------- Código da modal de baixa, dar baixa etc. ----------
    const inputQuantidadeBaixa = document.getElementById('quantidadeBaixa');
    const confirmarBaixaBtn = document.getElementById('confirmarBaixaBtn');
    const btnDarBaixa = document.getElementById('btnDarBaixa');

    btnDarBaixa.addEventListener('click', function () {
        if (!itemSelecionado) return;

        document.getElementById('nomeCodigoBaixa').innerHTML =
            `<strong>Item: </strong> ${itemSelecionado.nome} (Código: ${itemSelecionado.codigo})`;

        document.getElementById('quantidadeAtualBaixa').innerHTML =
            `<strong>Quantidade atual: </strong> ${itemSelecionado.quantidade}`;

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
            const response = await fetch(`http://localhost:5000/itens/${itemSelecionado.codigo}`, {
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

    // Inicializa tudo
    carregarItens();
});